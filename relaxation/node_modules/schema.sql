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
