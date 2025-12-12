import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { member_id, menu_id, customer_name, customer_email, customer_phone, appointment_date, appointment_start_time } = body

    if (!member_id || !menu_id || !appointment_date || !appointment_start_time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // メニューの施術時間を取得
    const { data: menu, error: menuError } = await supabase
      .from('menus')
      .select('duration_minutes')
      .eq('id', menu_id)
      .single()

    if (menuError) throw menuError

    // 終了時刻を計算
    const [hours, minutes] = appointment_start_time.split(':').map(Number)
    const endHours = hours + Math.floor((minutes + menu.duration_minutes) / 60)
    const endMinutes = (minutes + menu.duration_minutes) % 60
    const appointment_end_time = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`

    // 予約を作成
    const { data, error } = await supabase
      .from('bookings')
      .insert([
        {
          member_id,
          menu_id,
          customer_name: customer_name || 'Guest',
          customer_email,
          customer_phone,
          appointment_date,
          appointment_start_time,
          appointment_end_time,
          status: 'confirmed'
        }
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ success: true, booking: data[0] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
