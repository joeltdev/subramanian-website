#!/bin/bash

# --- Configuration ---
SERVER_IP="212.111.31.91"
SERVER_USER="pruvious"
SSH_KEY="~/.ssh/pruvious_key"
APP_DIR="/home/pruvious/sites/inels-content-studio"
# ---------------------

echo "🚀 Starting rsync Deployment to $SERVER_IP..."

# 1. Create directory on server if it doesn't exist
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP "mkdir -p $APP_DIR"

# 2. Sync files (excluding heavy/local-only folders)
echo "📦 Syncing files..."
rsync -avz -e "ssh -i $SSH_KEY" \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude '.env' \
  --exclude 'test-results' \
  --exclude 'playwright-report' \
  ./ $SERVER_USER@$SERVER_IP:$APP_DIR/

# 3. SSH into server and build
echo "🌐 Building on Server..."
ssh -i $SSH_KEY $SERVER_USER@$SERVER_IP << EOF
  # Manually source environment files
  [ -f ~/.profile ] && source ~/.profile
  [ -f ~/.bashrc ] && source ~/.bashrc
  [ -f ~/.bash_profile ] && source ~/.bash_profile
  [ -s ~/.nvm/nvm.sh ] && source ~/.nvm/nvm.sh
  
  # Add common local bin paths just in case
  export PATH="\$PATH:\$HOME/.local/share/pnpm:\$HOME/.pnpm-bin:\$HOME/bin"

  cd $APP_DIR
  
  echo "🛠️ Installing dependencies..."
  pnpm install --no-frozen-lockfile

  echo "🏗️ Building the application..."
  pnpm build

  echo "🔄 Restarting PM2 process..."
  pm2 reload inels-payload.config.cjs || pm2 start inels-payload.config.cjs
  
  echo "✅ Deployment Successful!"
EOF
