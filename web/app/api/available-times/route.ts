import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const member_id = searchParams.get('member_id')
  const date = searchParams.get('date') // YYYY-MM-DD

  if (!member_id || !date) {
    return NextResponse.json({ error: 'member_id and date required' }, { status: 400 })
  }

  try {
    // その日のメンバー営業時間を取得
    const { data: availability, error: avError } = await supabase
      .from('member_availability')
      .select('*')
      .eq('member_id', member_id)
      .eq('date', date)
      .single()

    if (avError && avError.code !== 'PGRST116') throw avError

    // その日の既存予約を取得
    const { data: bookings, error: bookError } = await supabase
      .from('bookings')
      .select('appointment_start_time, appointment_end_time')
      .eq('member_id', member_id)
      .eq('appointment_date', date)
      .eq('status', 'confirmed')

    if (bookError) throw bookError

    // 営業時間内で、予約が入っていない枠を返す
    const startTime = availability?.start_time || '10:00'
    const endTime = availability?.end_time || '22:00'
    const isAvailable = availability?.is_available ?? true

    if (!isAvailable) {
      return NextResponse.json({ availableTimes: [] })
    }

    // シンプルに1時間ごとのスロット生成
    const availableTimes = generateTimeSlots(startTime, endTime, bookings || [])

    return NextResponse.json({ availableTimes })
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

function generateTimeSlots(startTime: string, endTime: string, bookings: any[]) {
  const slots = []
  const [startHour] = startTime.split(':').map(Number)
  const [endHour] = endTime.split(':').map(Number)

  for (let hour = startHour; hour < endHour; hour++) {
    const time = `${String(hour).padStart(2, '0')}:00`
    const isBooked = bookings.some(
      (b) => b.appointment_start_time.substring(0, 5) === time
    )
    if (!isBooked) {
      slots.push(time)
    }
  }

  return slots
}
