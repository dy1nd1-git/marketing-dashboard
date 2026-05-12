# Pull Request (PR) Generator Guidelines

This document serves as a strict rule for the AI Assistant.

## Rule: Post-Push PR Summary
Whenever the AI Assistant executes a `git push`, the Assistant **MUST ALWAYS** immediately output a "Pull Request Summary" in the chat. This summary is intended for the user to copy and paste directly into the GitHub PR description box.

## Output Format
The AI Assistant must output the following format in the chat using standard Markdown:

```markdown
### 📝 PR Summary for GitHub
*(Copy and paste the below text into your Pull Request description)*

---

## 🎯 目的 (Objective)
- [Task-XXX] の完了のため
- なぜこの変更を行ったのかの簡潔な説明

## 🛠 行った変更 (Changes)
- [Frontend] 〇〇コンポーネントの追加
- [Backend] BigQuery連携ロジックの修正
- その他、設定ファイルの変更など

## ⚠️ 懸念事項・確認事項 (Notes)
- 動作確認が必要な箇所
- 新たに追加された環境変数 (.env) などがあれば明記
```

## Enforcement
This rule applies to all future pushes to remote branches. The AI must proactively provide this without being asked.
