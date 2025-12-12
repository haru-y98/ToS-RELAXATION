const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://isduqadpcgirxhejhyzw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzZHVxYWRwY2dpcnhoZWpoeXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1MTgzNTgsImV4cCI6MjA4MTA5NDM1OH0.EWoe-DvWq5Xt52feTxtqG7hTxeBT6uFU6d8IANde67s';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  console.log('🚀 データベースセットアップを開始します...\n');

  try {
    // テストデータを追加
    console.log('📝 テストデータを投入中...');

    // メンバーデータ
    const members = [
      {
        name: '太郎',
        age: 28,
        height: 175,
        weight: 75,
        residence: '東京都渋谷区',
        dispatch_status: 'どちらも可能',
        qualification: '国家資格所有',
        appeal_comment: '経験10年以上のプロフェッショナルです。リラックスできる空間をご提供します。',
        internal_status: 'NEW',
        display_order: 1,
        is_active: true
      },
      {
        name: '次郎',
        age: 32,
        height: 180,
        weight: 80,
        residence: '東京都新宿区',
        dispatch_status: '出張可',
        qualification: '民間資格所有',
        appeal_comment: '丁寧な施術を心がけています。お客様の悩みに寄り添います。',
        internal_status: '人気',
        display_order: 2,
        is_active: true
      },
      {
        name: '三郎',
        age: 25,
        height: 170,
        weight: 68,
        residence: '東京都世田谷区',
        dispatch_status: '場所有',
        qualification: 'なし',
        appeal_comment: '若手ですが技術には自信があります。お気軽にお試しください。',
        internal_status: '通常',
        display_order: 3,
        is_active: true
      }
    ];

    const { data: insertedMembers, error: membersError } = await supabase
      .from('members')
      .insert(members)
      .select();

    if (membersError) {
      console.error('❌ メンバー追加エラー:', membersError);
      throw membersError;
    }

    console.log('✅ メンバーを追加しました:', insertedMembers.length, '件');

    // メニューデータ
    const menus = [
      // 太郎のメニュー
      {
        member_id: insertedMembers[0].id,
        service_name: '60分基本コース',
        duration_minutes: 60,
        price: 8000,
        description: '全身をほぐす基本的なマッサージコースです',
        is_available: true
      },
      {
        member_id: insertedMembers[0].id,
        service_name: '90分しっかりコース',
        duration_minutes: 90,
        price: 12000,
        description: 'じっくり時間をかけて全身を丁寧にほぐします',
        is_available: true
      },
      {
        member_id: insertedMembers[0].id,
        service_name: '120分スペシャルコース',
        duration_minutes: 120,
        price: 15000,
        description: '最高のリラクゼーション体験をお届けします',
        is_available: true
      },
      // 次郎のメニュー
      {
        member_id: insertedMembers[1].id,
        service_name: '60分リラックスコース',
        duration_minutes: 60,
        price: 9000,
        description: 'ストレス解消に最適なコースです',
        is_available: true
      },
      {
        member_id: insertedMembers[1].id,
        service_name: '90分プレミアムコース',
        duration_minutes: 90,
        price: 13000,
        description: '上質な時間をお過ごしいただけます',
        is_available: true
      },
      // 三郎のメニュー
      {
        member_id: insertedMembers[2].id,
        service_name: '60分お試しコース',
        duration_minutes: 60,
        price: 7000,
        description: 'はじめての方におすすめのコースです',
        is_available: true
      },
      {
        member_id: insertedMembers[2].id,
        service_name: '90分リフレッシュコース',
        duration_minutes: 90,
        price: 10000,
        description: '疲れを癒やすリフレッシュコースです',
        is_available: true
      }
    ];

    const { data: insertedMenus, error: menusError } = await supabase
      .from('menus')
      .insert(menus)
      .select();

    if (menusError) {
      console.error('❌ メニュー追加エラー:', menusError);
      throw menusError;
    }

    console.log('✅ メニューを追加しました:', insertedMenus.length, '件');

    // 営業時間データ（次の7日間）
    const availabilities = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];

      for (const member of insertedMembers) {
        availabilities.push({
          member_id: member.id,
          date: dateStr,
          start_time: '10:00',
          end_time: '22:00',
          is_available: true
        });
      }
    }

    const { data: insertedAvailability, error: availabilityError } = await supabase
      .from('member_availability')
      .insert(availabilities)
      .select();

    if (availabilityError) {
      console.error('❌ 営業時間追加エラー:', availabilityError);
      throw availabilityError;
    }

    console.log('✅ 営業時間を追加しました:', insertedAvailability.length, '件');

    console.log('\n🎉 データベースセットアップが完了しました!\n');
    console.log('📊 追加されたデータ:');
    console.log('  - メンバー:', insertedMembers.length, '人');
    console.log('  - メニュー:', insertedMenus.length, '件');
    console.log('  - 営業時間:', insertedAvailability.length, '件');
    console.log('\n✨ http://localhost:3000 にアクセスしてください!\n');

  } catch (error) {
    console.error('❌ セットアップエラー:', error.message);
    process.exit(1);
  }
}

setupDatabase();
