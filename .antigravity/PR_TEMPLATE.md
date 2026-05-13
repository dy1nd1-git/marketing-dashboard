# Pull Request (PR) Generator Guidelines

This document serves as a strict rule for the AI Assistant.

## Rule: Post-Push PR Summary
Whenever the AI Assistant executes a `git push`, the Assistant **MUST ALWAYS** immediately output a "Pull Request Summary" in the chat. This summary is intended for the user to copy and paste directly into the GitHub PR description box.

## Output Format
The AI Assistant **MUST ALWAYS** output the summary inside a `markdown` language code block (using triple backticks: \`\`\`markdown ... \`\`\`) to preserve all exact markdown syntax.
**【重要・コードブロック囲みの厳守】**: チャット上に平文で出力すると、チャットUIが見出し記号（`##`）等を自動レンダリングしてしまい、ユーザーがテキストを選択してコピーした際にクリップボードへ見出し記号が欠落して格納される問題が発生する。これを完全に防ぐため、**出力全体を必ずMarkdownコードブロックで囲み、右上の「コピー」ボタンから生のMarkdownソースをそのままコピーできる状態を絶対保証すること**。
内部の記述自体も、単なるプレーンテキストの羅列を防ぐため、必ずリスト記法（`-`）や太字（`**`）、絵文字装飾を用いた高度な構造化を徹底せよ。

以下のようなコードブロックで囲まれたフォーマットを出力せよ：

```markdown
### 📝 PR Summary for GitHub
*(Copy and paste the below text into your Pull Request description)*

---

## 🎯 目的 (Objective)

**【本PRのゴール】**
**[Task-XXX] 〇〇の機能実装および〇〇の改善**

- 🎨 **〇〇の視覚的・体験的向上**
  - 既存の〇〇という課題に対し、〇〇の設計を導入することで直感的な操作性を実現します。
- ⚙️ **〇〇の安定性・型整合性の確保**
  - 〇〇における設定や依存関係を最適化し、開発環境での警告排除と型安全性を確立します。

## 🛠 行った変更 (Changes)

- **[Frontend] 〇〇コンポーネントの刷新・実装**
  - 〇〇関数を用いて絶対座標を算出し、〇〇の構造へ全面リライトしました。
- **[Backend/Config] 〇〇連携・設定の最適化**
  - 〇〇の設定ファイルを公式の仕様・型定義に合致するようトップレベルへ引き上げました。
- **品質基準の完全証明**
  - 統合テスト（全〇〇テスト）および品質ゲートスクリプトをエラー0件で通過済みです。

## ⚠️ 懸念事項・確認事項 (Notes)

- **イベント・動作の安全性**
  - 〇〇のスクロールやクリック動作との切り分けを行い、意図しない挙動が発生しないことを確認済みです。
- **下位互換性**
  - 破壊的変更はなく、既存データ構造やアクセシビリティ要件との完全な下位互換性を確保しています。
```

## Enforcement
This rule applies to all future pushes to remote branches. The AI must proactively provide this beautifully formatted markdown block without being asked.
