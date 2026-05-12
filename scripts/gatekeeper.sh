#!/bin/bash

# Decision Tracer - Gatekeeper Script (Article 3.2)
# Usage: ./scripts/gatekeeper.sh [task-id]

TASK_ID=$1
COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_NC='\033[0m'

echo "--- 🛡️ Starting Gatekeeper Audit ---"

# 1. Branch Check
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ $CURRENT_BRANCH == feature/task-* ]] || [[ $CURRENT_BRANCH == style/* ]] || [[ $CURRENT_BRANCH == fix/* ]]; then
    echo -e "${COLOR_GREEN}[PASS]${COLOR_NC} Branch Check: $CURRENT_BRANCH"
else
    echo -e "${COLOR_RED}[FAIL]${COLOR_NC} Article 1 Violation: Current branch '$CURRENT_BRANCH' is not a feature branch."
    exit 1
fi

# 2. Backend Check
echo "Checking Backend (Go)..."
cd backend && go build -o /dev/null ./cmd/main.go
if [ $? -eq 0 ]; then
    echo -e "${COLOR_GREEN}[PASS]${COLOR_NC} Backend Build"
else
    echo -e "${COLOR_RED}[FAIL]${COLOR_NC} Backend Build failed."
    exit 1
fi
cd ..

# 3. Frontend Check
echo "Checking Frontend (TypeScript & Lint project-wide)..."
cd frontend && npx tsc --noEmit && npm run lint
if [ $? -eq 0 ]; then
    echo -e "${COLOR_GREEN}[PASS]${COLOR_NC} Frontend Quality Check"
else
    echo -e "${COLOR_RED}[FAIL]${COLOR_NC} Frontend Quality Check failed (Type or Lint error)."
    exit 1
fi
cd ..

echo -e "--- 🏆 Audit SUCCESS: All Article 5 criteria met ---"
