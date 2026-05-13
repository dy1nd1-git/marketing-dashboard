# Pull Request (PR) Generator Guidelines

This document serves as a strict rule for the AI Assistant.

## Rule: Post-Push PR Summary
Whenever the AI Assistant executes a `git push`, the Assistant **MUST ALWAYS** immediately output a "Pull Request Summary" in the chat. This summary is intended for the user to copy and paste directly into the GitHub PR description box.

## Output Format
The AI Assistant must output the following format in the chat using standard Markdown.
**【重要・美麗な表示状態の保証】**: ユーザーがコピーしてGitHubのPR画面にそのまま貼り付けた際、美しいプレビュー（綺麗に整ったレイアウト）となるよう、箇条書きの階層インデントや太字による項目名の強調(`**`)、コードブロック表記などを徹底して調整・整形してから渡すこと。

```markdown
### 📝 PR Summary for GitHub
*(Copy and paste the below text into your Pull Request description)*

---

## 🎯 目的 (Objective)
- **[Task-XXX] の完了および〇〇の改善のため**
- なぜこの変更を行ったのか、既存課題と解決へのアプローチを具体的かつ読みやすい構成で記述する。

## 🛠 行った変更 (Changes)
- **[Frontend] 〇〇コンポーネントの追加・改修**
  - 詳細な変更内容や導入した設計パターン（箇条書きを適切にインデントさせて階層化する）
- **[Backend] 〇〇連携ロジックの修正**
  - 変更点とその効果を明確に記述する

## ⚠️ 懸念事項・確認事項 (Notes)
- 動作確認が必要な箇所や検証済みのパス状態
- 新たに追加された環境変数 (`.env`) などがあればインラインコード表記を用いて明記
```

## Enforcement
This rule applies to all future pushes to remote branches. The AI must proactively provide this beautifully formatted markdown block without being asked.
