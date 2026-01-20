# OpenAI API統合ガイド

## 概要

Admin Dashboardに、SubmissionのanswerをOpenAI APIに送信して評価を取得する機能を追加しました。

## セットアップ

### 1. OpenAI APIキーの取得

1. [OpenAI Platform](https://platform.openai.com/)にアクセス
2. API Keyを作成
3. `.env`ファイルにAPIキーを設定

```bash
OPENAI_API_KEY="sk-your-api-key-here"
```

### 2. 環境変数の設定

`.env.example`を参考に`.env`ファイルを作成してください。

## 機能

### 単一のSubmissionを送信

**エンドポイント:** `POST /api/admin/openai`

**リクエスト例:**

```json
{
  "submissionId": "submission-id-here",
  "prompt": "カスタムプロンプト（オプション）"
}
```

**レスポンス例:**

```json
{
  "success": true,
  "submission": {
    "id": "submission-id",
    "workerId": "worker-123",
    "dayIdx": 1,
    "answer": "提出された回答テキスト",
    "submittedAt": "2026-01-18T12:00:00.000Z"
  },
  "openaiResponse": "AIによる評価結果...",
  "usage": {
    "prompt_tokens": 150,
    "completion_tokens": 200,
    "total_tokens": 350
  }
}
```

### 複数のSubmissionを一括送信

**エンドポイント:** `PUT /api/admin/openai`

**リクエスト例:**

```json
{
  "submissionIds": ["id1", "id2", "id3"],
  "prompt": "カスタムプロンプト（オプション）"
}
```

**レスポンス例:**

```json
{
  "success": true,
  "totalProcessed": 3,
  "results": [
    {
      "submissionId": "id1",
      "workerId": "worker-123",
      "dayIdx": 1,
      "success": true,
      "openaiResponse": "評価結果...",
      "usage": {...}
    },
    // ... その他の結果
  ]
}
```

## Admin Dashboardの使い方

1. `/admin/dashboard`にアクセス
2. "Submissions"カードで提出データの一覧を確認
3. 評価したい提出をクリックして選択
4. 必要に応じてカスタムプロンプトを入力
5. "OpenAI APIに送信"ボタンをクリック
6. AIの評価結果が表示されます

## デフォルトプロンプト

カスタムプロンプトを指定しない場合、以下のデフォルトプロンプトが使用されます：

```
以下の回答を評価してください。
回答の質、明確さ、完成度を1-10のスケールで評価し、改善点を提案してください。
```

## 使用モデル

- デフォルト: `gpt-4o-mini`
- 必要に応じて`route.ts`ファイルでモデルを変更できます

## セキュリティ

- Admin認証が必要（JWTトークンによる認証）
- ログインしていない場合は401エラーが返されます

## コスト管理

OpenAI APIの使用量は課金対象です：

- レスポンスに使用トークン数が含まれています
- 大量のSubmissionを処理する場合は、コストに注意してください

## エラーハンドリング

- APIキーが設定されていない場合: 500エラー
- Submissionが見つからない場合: 404エラー
- 認証エラー: 401エラー
- その他のエラー: 詳細なエラーメッセージが返されます

## カスタマイズ

`/app/api/admin/openai/route.ts`を編集することで：

- 使用するモデルの変更
- プロンプトのカスタマイズ
- レスポンスフォーマットの変更
  などが可能です。
