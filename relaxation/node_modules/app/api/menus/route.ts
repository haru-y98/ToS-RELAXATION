import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const member_id = searchParams.get('member_id')

  if (!member_id) {
    return NextResponse.json({ error: 'member_id required' }, { status: 400 })
  }

  try {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('member_id', member_id)
      .eq('is_available', true)

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
