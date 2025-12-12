# ToS Relaxation MVP

ゲイ向けマッサージサービス予約サイトのMVPです。

## 🚀 セットアップ手順

### 1. Supabaseでテーブルを作成

以下のURLにアクセスしてください:
https://app.supabase.com/project/isduqadpcgirxhejhyzw/sql/new

そして、`schema.sql` の内容をコピー&ペーストして実行してください。

### 2. テストデータを投入

同じSQL Editorで、以下のコマンドを実行してください:

```bash
node setup-database.js
```

または、`test-data.sql` の内容をSupabase SQL Editorで実行してください。

### 3. 開発サーバーを起動

```bash
npm run dev
```

http://localhost:3000 にアクセスしてください。

## 📁 プロジェクト構成

```
relaxation/
├── app/
│   ├── api/
│   │   ├── members/route.ts       # メンバー一覧API
│   │   ├── menus/route.ts         # メニュー取得API
│   │   ├── available-times/route.ts # 空き時間取得API
│   │   └── bookings/route.ts      # 予約作成API
│   ├── booking/
│   │   └── page.tsx               # 予約フォーム
│   ├── therapists/
│   │   └── page.tsx               # 施術者一覧
│   ├── layout.tsx
│   ├── page.tsx                   # トップページ
│   └── globals.css
├── components/
│   └── MemberModal.tsx            # 施術者詳細モーダル
├── lib/
│   └── supabase.ts                # Supabase クライアント
├── schema.sql                     # データベーススキーマ
├── test-data.sql                  # テストデータ
└── setup-database.js              # セットアップスクリプト

```

## 🎯 実装済み機能

- ✅ トップページ
- ✅ 施術者一覧（グリッド表示）
- ✅ 施術者詳細モーダル
- ✅ 予約フォーム（日付・時間・メニュー選択）
- ✅ 予約確定機能

## 🔜 今後の実装予定

- メンバー営業時間設定UI（カレンダー）
- メンバー認証 + プロフィール編集
- オーナー予約管理画面
- Realtime 連動（予約競合防止）
- メール送信機能

## 📊 データベース構成

### members テーブル
- 施術者の基本情報（名前、年齢、身長、体重、居住地など）
- 資格情報、出張対応ステータス
- 表示順、アクティブフラグ

### menus テーブル
- 施術メニュー（サービス名、時間、料金）
- メンバーとの関連付け

### member_availability テーブル
- 施術者の営業時間
- 日付ごとの稼働状況

### bookings テーブル
- 予約情報（顧客名、日時、メニュー）
- 予約ステータス管理
