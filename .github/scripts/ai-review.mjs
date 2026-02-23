#!/usr/bin/env node
/**
 * AI Multi-Agent Code Review Orchestrator
 * Calls Anthropic API with 6 specialized agent roles in parallel,
 * synthesizes findings, and posts a GitHub issue with consolidated results.
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;
const GITHUB_EVENT_NAME = process.env.GITHUB_EVENT_NAME || 'workflow_dispatch';
const GITHUB_REF = process.env.GITHUB_REF || '';
const GITHUB_SHA = process.env.GITHUB_SHA || '';
const PR_NUMBER = process.env.PR_NUMBER || '';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1500;
const MAX_CONTEXT_CHARS = 12000;
const GITHUB_API = 'https://api.github.com';

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY is not set. Add it to your GitHub repo secrets.');
  process.exit(1);
}
if (!GITHUB_TOKEN) {
  console.error('❌ GITHUB_TOKEN is not set.');
  process.exit(1);
}

// ─── Trigger Detection ────────────────────────────────────────────────────────

function detectTrigger() {
  if (GITHUB_EVENT_NAME === 'schedule') return 'nightly';
  if (GITHUB_EVENT_NAME === 'pull_request') return 'pr';
  return 'push';
}

// ─── Context Building ─────────────────────────────────────────────────────────

function safeExec(cmd, options = {}) {
  try {
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024, ...options }).trim();
  } catch {
    return '';
  }
}

function safeReadFile(filePath) {
  try {
    if (!existsSync(filePath)) return '';
    return readFileSync(filePath, 'utf8');
  } catch {
    return '';
  }
}

function truncate(str, maxLen = MAX_CONTEXT_CHARS) {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen) + `\n\n[... truncated at ${maxLen} chars ...]`;
}

function buildDirectoryTree() {
  // Get a concise tree of source files, excluding noise
  const tree = safeExec(
    `find src .github -type f \\( -name "*.ts" -o -name "*.tsx" -o -name "*.mjs" \\) ` +
    `! -path "*/node_modules/*" ! -path "*/.next/*" ! -path "*/dist/*" ` +
    `| sort | head -80`
  );
  return tree || 'Unable to read directory tree';
}

function buildPushPrContext() {
  const diff = safeExec(
    `git diff HEAD~1 -- ':!*.lock' ':!pnpm-lock.yaml' ':!.next' ':!node_modules'`
  );
  const changedFiles = safeExec(`git diff HEAD~1 --name-only`);
  const recentLog = safeExec(`git log --oneline -10`);
  const tree = buildDirectoryTree();

  return {
    diff: truncate(diff || 'No diff available (first commit or no changes)'),
    changedFiles,
    recentLog,
    fileTree: truncate(tree, 4000),
    type: 'diff',
  };
}

function buildNightlyContext() {
  const payloadConfig = truncate(safeReadFile('src/payload.config.ts'), 3000);

  // Read all collection files
  const collectionsDir = 'src/collections';
  let collectionsContent = '';
  if (existsSync(collectionsDir)) {
    const files = readdirSync(collectionsDir, { recursive: true })
      .filter(f => String(f).endsWith('.ts') || String(f).endsWith('.tsx'))
      .slice(0, 20);
    for (const file of files) {
      const content = safeReadFile(join(collectionsDir, String(file)));
      if (content) {
        collectionsContent += `\n\n### ${file}\n${content}`;
      }
    }
  }

  // Read blocks directory listing
  const blocksDir = 'src/blocks';
  let blocksList = '';
  if (existsSync(blocksDir)) {
    blocksList = safeExec(`find ${blocksDir} -type f \\( -name "*.ts" -o -name "*.tsx" \\) | sort`);
  }

  const recentLog = safeExec(`git log --oneline -20`);
  const tree = buildDirectoryTree();

  return {
    payloadConfig,
    collectionsContent: truncate(collectionsContent, 5000),
    blocksList,
    recentLog,
    fileTree: truncate(tree, 3000),
    type: 'nightly',
  };
}

function buildContext(trigger) {
  console.log(`📦 Building context for trigger: ${trigger}`);
  if (trigger === 'nightly') return buildNightlyContext();
  return buildPushPrContext();
}

// ─── Agent Definitions ────────────────────────────────────────────────────────

const AGENTS = [
  {
    role: 'Software Engineer',
    emoji: '👷',
    systemPrompt: `You are a senior software engineer reviewing a Payload CMS 3.x + Next.js 15 + TypeScript codebase.
Focus on: TypeScript type safety, Payload config patterns and best practices, error handling, security vulnerabilities (XSS, injection, auth bypasses), database query safety, API design, code duplication, and performance anti-patterns.
Be specific — reference file names and line numbers where possible. Format findings as a concise bulleted list.`,
  },
  {
    role: 'Frontend Developer',
    emoji: '⚛️',
    systemPrompt: `You are a senior frontend developer reviewing a Next.js 15 App Router + React 19 codebase with Payload CMS.
Focus on: React 19 patterns (Server Components, Client Components, use() hook), Next.js 15 App Router conventions, SSR/ISR/CSR strategies, bundle size concerns, unnecessary re-renders, improper data fetching patterns, missing Suspense boundaries, and component composition anti-patterns.
Be specific — reference file names where possible. Format findings as a concise bulleted list.`,
  },
  {
    role: 'UX Engineer',
    emoji: '🎨',
    systemPrompt: `You are a UX engineer reviewing a content management system and public-facing Next.js site.
Focus on: Accessibility (ARIA attributes, keyboard navigation, focus management, screen reader support), responsive behavior, loading and error states, form UX and validation feedback, navigation intuitiveness, and content hierarchy.
Be specific — reference components or pages where possible. Format findings as a concise bulleted list.`,
  },
  {
    role: 'UI Designer',
    emoji: '🖌️',
    systemPrompt: `You are a UI designer reviewing a Next.js site using TailwindCSS v4 and shadcn/ui components.
Focus on: TailwindCSS v4 utility consistency, shadcn/ui usage patterns, design system adherence, visual hierarchy, spacing and layout consistency, color contrast, typography scale, and component style inconsistencies.
Be specific — reference component files or class patterns where possible. Format findings as a concise bulleted list.`,
  },
  {
    role: 'Product Manager',
    emoji: '📋',
    systemPrompt: `You are a product manager reviewing a Payload CMS-powered content site.
Focus on: Feature completeness relative to a CMS platform, content model design and flexibility, SEO configuration quality, Payload admin panel usability, missing content relationships or hooks, media handling, and overall CMS usefulness for editors.
Be specific about gaps or improvement opportunities. Format findings as a concise bulleted list.`,
  },
  {
    role: 'End User',
    emoji: '👤',
    systemPrompt: `You are representing the perspective of a real end user visiting a content website built with Next.js and Payload CMS.
Focus on: Page load experience, navigation clarity, content readability, mobile experience, broken or confusing user flows, missing feedback states, and overall first impression quality.
Be specific about which pages or components affect the experience. Format findings as a concise bulleted list.`,
  },
];

// ─── Anthropic API Call ───────────────────────────────────────────────────────

async function callClaude(agent, userMessage) {
  console.log(`  🤖 Calling agent: ${agent.emoji} ${agent.role}`);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: agent.systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'No response generated.';
}

function buildUserMessage(agent, context) {
  if (context.type === 'nightly') {
    return `Please review this Payload CMS + Next.js 15 codebase from your perspective as ${agent.role}.

## Directory Structure
\`\`\`
${context.fileTree}
\`\`\`

## payload.config.ts
\`\`\`typescript
${context.payloadConfig || 'Not found'}
\`\`\`

## Collections
${context.collectionsContent || 'No collections found'}

## Blocks Directory
\`\`\`
${context.blocksList || 'No blocks found'}
\`\`\`

## Recent Git Activity (last 20 commits)
\`\`\`
${context.recentLog}
\`\`\`

Provide your top findings and recommendations. Be specific and actionable.`;
  }

  return `Please review these recent changes to a Payload CMS + Next.js 15 codebase from your perspective as ${agent.role}.

## Changed Files
\`\`\`
${context.changedFiles || 'No file list available'}
\`\`\`

## Git Diff
\`\`\`diff
${context.diff}
\`\`\`

## Directory Structure (for context)
\`\`\`
${context.fileTree}
\`\`\`

## Recent Commits
\`\`\`
${context.recentLog}
\`\`\`

Provide your top findings and recommendations on these changes. Be specific and actionable.`;
}

// ─── Synthesis Agent ──────────────────────────────────────────────────────────

async function synthesize(agentResults) {
  console.log('🔗 Synthesizing findings...');

  const combinedFindings = agentResults
    .map(r => `### ${r.emoji} ${r.role}\n${r.findings}`)
    .join('\n\n');

  const truncatedFindings = truncate(combinedFindings, 10000);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 800,
      system: `You are a technical lead synthesizing code review findings from multiple specialist agents.
Create a prioritized list of the TOP 10 most important action items, combining and deduplicating related findings.
Format as a numbered list. Each item should be 1-2 sentences, specific, and actionable.
Order by impact: critical bugs > security > performance > UX > code quality > design.`,
      messages: [
        {
          role: 'user',
          content: `Synthesize these findings from ${agentResults.length} specialist reviewers into the top 10 prioritized action items:\n\n${truncatedFindings}`,
        },
      ],
    }),
  });

  if (!response.ok) {
    return 'Synthesis unavailable — see individual agent findings below.';
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'No synthesis generated.';
}

// ─── GitHub Issue Creation ────────────────────────────────────────────────────

async function ensureLabels() {
  const labelsToCreate = [
    { name: 'ai-review', color: '7B61FF', description: 'Automated AI code review' },
    { name: 'automated', color: 'EDEDED', description: 'Created by automation' },
  ];

  for (const label of labelsToCreate) {
    try {
      await fetch(`${GITHUB_API}/repos/${GITHUB_REPOSITORY}/labels`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github+json',
        },
        body: JSON.stringify(label),
      });
      // Ignore 422 (label already exists) — any error is fine here
    } catch {
      // Labels might already exist
    }
  }
}

function buildTriggerDescription() {
  const shortSha = GITHUB_SHA.slice(0, 7);
  const runUrl = `https://github.com/${GITHUB_REPOSITORY}/actions`;

  if (GITHUB_EVENT_NAME === 'pull_request' && PR_NUMBER) {
    return `PR #${PR_NUMBER}`;
  }
  if (GITHUB_EVENT_NAME === 'schedule') {
    return 'Scheduled nightly run';
  }
  if (GITHUB_EVENT_NAME === 'workflow_dispatch') {
    return 'Manual trigger';
  }
  const branch = GITHUB_REF.replace('refs/heads/', '');
  return `Push to \`${branch}\` (sha: \`${shortSha}\`)`;
}

function buildIssueBody(agentResults, summary, trigger) {
  const date = new Date().toISOString().split('T')[0];
  const triggerDesc = buildTriggerDescription();
  const runUrl = `https://github.com/${GITHUB_REPOSITORY}/actions`;
  const shortSha = GITHUB_SHA.slice(0, 7);

  const agentSections = agentResults
    .map(r => `## ${r.emoji} ${r.role}\n\n${r.findings}`)
    .join('\n\n---\n\n');

  return `# 🤖 AI Multi-Agent Review — ${date}

**Trigger:** ${triggerDesc}

## Executive Summary

${summary}

---

${agentSections}

---

*Generated by Claude ${MODEL} · [View workflow run](${runUrl}) · SHA: \`${shortSha}\`*`;
}

async function createGitHubIssue(agentResults, summary, trigger) {
  console.log('📝 Creating GitHub issue...');

  await ensureLabels();

  const date = new Date().toISOString().split('T')[0];
  const triggerEmoji = trigger === 'nightly' ? '🌙' : trigger === 'pr' ? '🔀' : '🚀';
  const title = `${triggerEmoji} AI Multi-Agent Review — ${date}`;
  const body = buildIssueBody(agentResults, summary, trigger);

  const response = await fetch(`${GITHUB_API}/repos/${GITHUB_REPOSITORY}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/vnd.github+json',
    },
    body: JSON.stringify({
      title,
      body,
      labels: ['ai-review', 'automated'],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error ${response.status}: ${errorText}`);
  }

  const issue = await response.json();
  console.log(`✅ Issue created: ${issue.html_url}`);
  return issue.html_url;
}

// ─── Main Orchestrator ────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 AI Multi-Agent Review starting...');
  console.log(`   Event: ${GITHUB_EVENT_NAME}`);
  console.log(`   Repo:  ${GITHUB_REPOSITORY}`);
  console.log(`   SHA:   ${GITHUB_SHA.slice(0, 7)}`);

  const trigger = detectTrigger();
  console.log(`   Trigger type: ${trigger}`);

  const context = buildContext(trigger);

  console.log('\n🤖 Running 6 agent reviews in parallel...');
  const agentPromises = AGENTS.map(async (agent) => {
    try {
      const userMessage = buildUserMessage(agent, context);
      const findings = await callClaude(agent, userMessage);
      return { role: agent.role, emoji: agent.emoji, findings };
    } catch (err) {
      console.error(`  ❌ Agent ${agent.role} failed: ${err.message}`);
      return {
        role: agent.role,
        emoji: agent.emoji,
        findings: `⚠️ This agent encountered an error: ${err.message}`,
      };
    }
  });

  const agentResults = await Promise.all(agentPromises);
  console.log(`✅ All ${agentResults.length} agents completed`);

  const summary = await synthesize(agentResults);

  const issueUrl = await createGitHubIssue(agentResults, summary, trigger);

  console.log('\n🎉 Review complete!');
  console.log(`   Issue: ${issueUrl}`);
}

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
