# Payload CMS Security Mandates

This reference documents critical security patterns for Payload CMS development.

## 1. Local API Access Control

By default, Local API operations bypass ALL access control, even when passing a user.

```typescript
// ✅ SECURE: Actually enforces the user's permissions
await payload.find({
  collection: 'posts',
  user: someUser,
  overrideAccess: false, // REQUIRED
})
```

**Rule**: When passing `user` to Local API, ALWAYS set `overrideAccess: false`.

## 2. Transaction Safety in Hooks

Nested operations in hooks without `req` break transaction atomicity.

```typescript
// ✅ ATOMIC: Same transaction
hooks: {
  afterChange: [
    async ({ doc, req }) => {
      await req.payload.create({
        collection: 'audit-log',
        data: { docId: doc.id },
        req, // Maintains atomicity
      })
    },
  ]
}
```

**Rule**: ALWAYS pass `req` to nested operations in hooks.

## 3. Prevent Infinite Hook Loops

Use `req.context` flags to prevent hook loops:

```typescript
// ✅ SAFE: Use context flag
hooks: {
  afterChange: [
    async ({ doc, req, context }) => {
      if (context.skipHooks) return

      await req.payload.update({
        collection: 'posts',
        id: doc.id,
        data: { views: doc.views + 1 },
        context: { skipHooks: true },
        req,
      })
    },
  ]
}
```
