#!/bin/bash

# Antigravity Custom Tool: Governance Auditor
# これ。は AI がタスク開始時に「憲法」を再認識するためのツールです。

COLOR_CYAN='\033[0;36m'
COLOR_YELLOW='\033[1;33m'
COLOR_NC='\033[0m'

echo -e "${COLOR_CYAN}--- 📜 Reading Project Promises (Articles 1-5) ---${COLOR_NC}"

# 1. TeamStructure.md の強制確認
if [ -f "../../30_projects/analysis app/00_Organization/TeamStructure.md" ]; then
    echo -e "${COLOR_YELLOW}[READING]${COLOR_NC} TeamStructure.md (The Constitution)"
    cat "../../30_projects/analysis app/00_Organization/TeamStructure.md" | grep "第.*条"
else
    echo "Warning: Constitution file not found."
fi

# 2. ブランチ適合性診断
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo -e "${COLOR_CYAN}--- 🔎 Current Status Audit ---${COLOR_NC}"
echo "Current Branch: $CURRENT_BRANCH"

if [[ $CURRENT_BRANCH == "dev" || $CURRENT_BRANCH == "main" ]]; then
    echo -e "${COLOR_YELLOW}[ALERT]${COLOR_NC} You are on a protected branch. DO NOT implement here."
fi

# 3. 未完了チェックリストの提示
echo -e "${COLOR_CYAN}--- ✅ Pending Verifications ---${COLOR_NC}"
find ../../30_projects/analysis\ app/04_Logs -name "pre_check_*.md" -exec grep -l "\[ \]" {} +

echo -e "${COLOR_CYAN}--- Audit Complete. Proceed with Article Compliance. ---${COLOR_NC}"
