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
