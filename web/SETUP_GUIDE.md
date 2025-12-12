# 🚀 ToS Relaxation セットアップガイド

## ⚡ クイックスタート（5分で完了）

### ステップ1: Supabaseでテーブルを作成（2分）

1. 以下のURLを開く:
   **https://app.supabase.com/project/isduqadpcgirxhejhyzw/sql/new**

2. 以下のSQLをコピー&ペーストして「RUN」をクリック:

```sql
-- Members テーブル
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  age INTEGER,
  height INTEGER,
  weight INTEGER,
  residence TEXT,
  dispatch_status TEXT DEFAULT 'どちらも可能',
  qualification TEXT DEFAULT 'なし',
  other_services TEXT,
  appeal_comment TEXT,
  thumbnail_image TEXT,
  internal_status TEXT DEFAULT '通常',
  display_order INTEGER DEFAULT 999,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_members_display_order ON members(display_order);
CREATE INDEX IF NOT EXISTS idx_members_is_active ON members(is_active);

-- Menus テーブル
CREATE TABLE IF NOT EXISTS menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  price INTEGER NOT NULL,
  description TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_menus_member_id ON menus(member_id);

-- Member Availability テーブル
CREATE TABLE IF NOT EXISTS member_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME DEFAULT '10:00',
  end_time TIME DEFAULT '22:00',
  is_available BOOLEAN DEFAULT true,
  break_start TIME,
  break_end TIME,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(member_id, date)
);

CREATE INDEX IF NOT EXISTS idx_member_availability_member_id ON member_availability(member_id);
CREATE INDEX IF NOT EXISTS idx_member_availability_date ON member_availability(date);

-- Bookings テーブル
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id),
  menu_id UUID NOT NULL REFERENCES menus(id),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  appointment_date DATE NOT NULL,
  appointment_start_time TIME NOT NULL,
  appointment_end_time TIME NOT NULL,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_member_id ON bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_bookings_appointment_date ON bookings(appointment_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- RLS (Row Level Security) ポリシーを有効化
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（エラー回避）
DROP POLICY IF EXISTS "Enable read access for all users" ON members;
DROP POLICY IF EXISTS "Enable read access for all users" ON menus;
DROP POLICY IF EXISTS "Enable read access for all users" ON member_availability;
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;

-- 全員が読み取り可能なポリシー
CREATE POLICY "Enable read access for all users" ON members FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON menus FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON member_availability FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON bookings FOR SELECT USING (true);

-- 全員が作成可能なポリシー（予約用）
CREATE POLICY "Enable insert for all users" ON bookings FOR INSERT WITH CHECK (true);
```

### ステップ2: テストデータを投入（1分）

同じSQL Editorで新しいクエリとして以下を実行:

```sql
-- テストデータ: メンバー追加
INSERT INTO members (name, age, height, weight, residence, dispatch_status, qualification, appeal_comment, internal_status, display_order, is_active)
VALUES
('太郎', 28, 175, 75, '東京都渋谷区', 'どちらも可能', '国家資格所有', '経験10年以上のプロフェッショナルです。リラックスできる空間をご提供します。', 'NEW', 1, true),
('次郎', 32, 180, 80, '東京都新宿区', '出張可', '民間資格所有', '丁寧な施術を心がけています。お客様の悩みに寄り添います。', '人気', 2, true),
('三郎', 25, 170, 68, '東京都世田谷区', '場所有', 'なし', '若手ですが技術には自信があります。お気軽にお試しください。', '通常', 3, true)
ON CONFLICT DO NOTHING;

-- 太郎のメニュー
INSERT INTO menus (member_id, service_name, duration_minutes, price, description, is_available)
SELECT id, '60分基本コース', 60, 8000, '全身をほぐす基本的なマッサージコースです', true
FROM members WHERE name = '太郎'
ON CONFLICT DO NOTHING;

INSERT INTO menus (member_id, service_name, duration_minutes, price, description, is_available)
SELECT id, '90分しっかりコース', 90, 12000, 'じっくり時間をかけて全身を丁寧にほぐします', true
FROM members WHERE name = '太郎'
ON CONFLICT DO NOTHING;

INSERT INTO menus (member_id, service_name, duration_minutes, price, description, is_available)
SELECT id, '120分スペシャルコース', 120, 15000, '最高のリラクゼーション体験をお届けします', true
FROM members WHERE name = '太郎'
ON CONFLICT DO NOTHING;

-- 次郎のメニュー
INSERT INTO menus (member_id, service_name, duration_minutes, price, description, is_available)
SELECT id, '60分リラックスコース', 60, 9000, 'ストレス解消に最適なコースです', true
FROM members WHERE name = '次郎'
ON CONFLICT DO NOTHING;

INSERT INTO menus (member_id, service_name, duration_minutes, price, description, is_available)
SELECT id, '90分プレミアムコース', 90, 13000, '上質な時間をお過ごしいただけます', true
FROM members WHERE name = '次郎'
ON CONFLICT DO NOTHING;

-- 三郎のメニュー
INSERT INTO menus (member_id, service_name, duration_minutes, price, description, is_available)
SELECT id, '60分お試しコース', 60, 7000, 'はじめての方におすすめのコースです', true
FROM members WHERE name = '三郎'
ON CONFLICT DO NOTHING;

INSERT INTO menus (member_id, service_name, duration_minutes, price, description, is_available)
SELECT id, '90分リフレッシュコース', 90, 10000, '疲れを癒やすリフレッシュコースです', true
FROM members WHERE name = '三郎'
ON CONFLICT DO NOTHING;

-- メンバーの営業時間を設定（次の30日間分）
INSERT INTO member_availability (member_id, date, start_time, end_time, is_available)
SELECT
  m.id,
  CURRENT_DATE + i,
  '10:00'::time,
  '22:00'::time,
  true
FROM members m
CROSS JOIN generate_series(0, 29) AS i
ON CONFLICT (member_id, date) DO NOTHING;
```

### ステップ3: アプリケーションを確認（1分）

開発サーバーは既に起動しています！

**http://localhost:3000** にアクセスしてください。

## ✅ 確認項目

- [ ] トップページが表示される
- [ ] 「施術者を探す」をクリックして施術者一覧が表示される
- [ ] 施術者カードをクリックして詳細モーダルが開く
- [ ] 「予約する」をクリックして予約フォームに遷移する
- [ ] 日付を選択すると時間が表示される
- [ ] メニューを選択して予約ボタンがクリックできる
- [ ] 予約完了のアラートが表示される

## 🎉 完成！

これでMVPが完全に動作します。

## 🔧 トラブルシューティング

### テーブルが作成できない場合

Supabaseダッシュボードの「Table Editor」で手動でテーブルを確認してください。

### データが表示されない場合

1. ブラウザのコンソールでエラーを確認
2. Supabase SQL Editorで `SELECT * FROM members;` を実行してデータを確認

### 開発サーバーが起動しない場合

```bash
npm run dev
```

を再実行してください。
