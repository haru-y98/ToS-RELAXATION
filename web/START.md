# 🎯 ToS Relaxation - クイックスタート

## 最速セットアップ（3ステップ）

### 1️⃣ Supabaseでテーブルを作成（1分）

以下のURLを開く:
**https://app.supabase.com/project/isduqadpcgirxhejhyzw/sql/new**

`schema.sql` の内容をコピー&ペーストして「RUN」をクリック

### 2️⃣ テストデータを投入（30秒）

以下のURLを開く:
**http://localhost:3000/setup.html**

「データベースをセットアップ」ボタンをクリック

### 3️⃣ アプリを確認（完了！）

**http://localhost:3000** にアクセス

---

## ✅ 確認事項

- [ ] 開発サーバーが起動している（`npm run dev`）
- [ ] Supabaseでテーブルを作成した
- [ ] テストデータを投入した
- [ ] トップページが表示される

---

## 🎉 これでMVP完成!

以下の機能がすぐに使えます:

- ✅ トップページ表示
- ✅ 施術者一覧（3人のテストデータ）
- ✅ 施術者詳細モーダル
- ✅ 予約フォーム
- ✅ 予約確定機能

---

## 📁 主要ファイル

- `app/page.tsx` - トップページ
- `app/therapists/page.tsx` - 施術者一覧
- `app/booking/page.tsx` - 予約フォーム
- `components/MemberModal.tsx` - 施術者詳細モーダル
- `app/api/` - APIエンドポイント

---

## 🆘 トラブルシューティング

### 開発サーバーが起動していない
```bash
npm run dev
```

### テーブルが作成できない
`SETUP_GUIDE.md` の詳細手順を確認してください

### データが表示されない
1. ブラウザのコンソールでエラーを確認
2. http://localhost:3000/setup.html でデータを再投入

---

## 📖 詳細ドキュメント

- `README.md` - プロジェクト概要
- `SETUP_GUIDE.md` - 詳細セットアップ手順
