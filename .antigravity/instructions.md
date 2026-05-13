## 🚨 Root Principles (Mandatory)
あなたは以下の「憲法」を遵守し、プロジェクトの「信頼の連鎖（Chain of Trust）」を維持する義務がある。

### 🛡️ Pre-Flight Custom Tool
**全てのセッション開始時、または新しいタスクへの着手時に、必ず以下のツールを実行し、現状を再認識せよ：**
- `./.antigravity/audit_governance.sh`

1. **New Task = New Branch**: `dev` からブランチを切らずに実装を始めることを固く禁ずる。
2. **Double-Check**: 実装完了前に必ず「Senior Reviewer」としての自己監査を行い、監査ログを残せ。
3. **Verification by Tooling**: 推論ではなく、`tsc`, `go build`, `gatekeeper.sh` の実効出力で完了を証明せよ。

## 🛠️ Workflow Steps
1. **Plan**: `TaskBoard.md` を更新し、`04_Logs/pre_check_XXX.md` を作成する。
2. **Branch First**: 【重要】**コードを1行でも変更（write_to_file / replace_file_content）する前に、必ず `git checkout -b` を実行して新しいブランチを作成すること。** プラン合意直後のこの基本動作をスキップしてはならない。
3. **Execute**: `.antigravity/gatekeeper.sh` をパスするまで実装を行う。
4. **Verify**: 新規機能やコンポーネントを追加する際は、必ず並行してVitestテストファイル（`*.test.tsx`）を記述・検証すること。`tsc` エラーおよびテスト失敗が 0 件であることを確認し、監査ログを添えて報告する。
5. **Push & PR**: `git push` を実行した後は、必ず `.antigravity/PR_TEMPLATE.md` のフォーマットに従い、チャット上に GitHub 用の PR サマリーを出力する。

## 🚫 Prohibited Actions
- `eslint-disable` によるエラーの無視。
- グローバルな型定義の無断変更。
- `00_Organization` 以下の定義に反する UI/UX の実装。
- 破壊的変更（削除等）の際の `grep` 検証漏れ。
- 親コンテナの見切れを回避する目的で、安易に画面中央固定の巨大モーダル（Center Modal）へ変更し、操作のコンテキストを分断すること。

## 🎨 UI/UX Implementation Guidelines
- **Popover / HUD の設計標準**:
  - ツールチップや詳細HUDを展開する際は、親要素の `overflow: hidden` によるクリッピングを防ぐため `createPortal` で `document.body` にマウントしつつ、**トリガー要素の絶対座標（`getBoundingClientRect()`）を算出して直近に追従展開する Floating Popover 方式** を標準設計とすること。
  - 画面端での表示見切れを防ぐスマートフリップ（上下反転）制御と、スクロールや外部クリック検知による安全なクローズ処理を必ず併装すること。
