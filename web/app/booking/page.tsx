'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Menu {
  id: string
  service_name: string
  duration_minutes: number
  price: number
}

export default function BookingPage() {
  const searchParams = useSearchParams()
  const member_id = searchParams.get('member_id')

  const [menus, setMenus] = useState<Menu[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [selectedMenuId, setSelectedMenuId] = useState('')
  const [availableTimes, setAvailableTimes] = useState<string[]>([])
  const [customerName, setCustomerName] = useState('')
  const [loading, setLoading] = useState(false)

  // メニュー取得
  useEffect(() => {
    if (member_id) {
      fetchMenus()
    }
  }, [member_id])

  // 日付変更時に利用可能時間を取得
  useEffect(() => {
    if (selectedDate && member_id) {
      fetchAvailableTimes()
    }
  }, [selectedDate, member_id])

  const fetchMenus = async () => {
    try {
      const res = await fetch(`/api/menus?member_id=${member_id}`)
      const data = await res.json()
      setMenus(data)
    } catch (error) {
      console.error('Error fetching menus:', error)
    }
  }

  const fetchAvailableTimes = async () => {
    try {
      const res = await fetch(`/api/available-times?member_id=${member_id}&date=${selectedDate}`)
      const data = await res.json()
      setAvailableTimes(data.availableTimes)
    } catch (error) {
      console.error('Error fetching available times:', error)
    }
  }

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          member_id,
          menu_id: selectedMenuId,
          customer_name: customerName || 'Guest',
          appointment_date: selectedDate,
          appointment_start_time: selectedTime
        })
      })

      if (res.ok) {
        const data = await res.json()
        alert(`予約完了！予約番号: ${data.booking.id}`)
        // リセット
        setSelectedDate('')
        setSelectedTime('')
        setSelectedMenuId('')
        setCustomerName('')
      } else {
        alert('予約に失敗しました')
      }
    } catch (error) {
      console.error('Booking error:', error)
      alert('エラーが発生しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">予約フォーム</h1>

        <form onSubmit={handleBooking} className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">名前（任意）</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="お名前"
            />
          </div>

          {/* 日付 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">日付</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            />
          </div>

          {/* 時間 */}
          {selectedDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">時間</label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full border border-gray-300 rounded px-4 py-2"
                required
              >
                <option value="">時間を選択</option>
                {availableTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* メニュー */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">メニュー</label>
            <select
              value={selectedMenuId}
              onChange={(e) => setSelectedMenuId(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            >
              <option value="">メニューを選択</option>
              {menus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.service_name} - ¥{menu.price.toLocaleString()} ({menu.duration_minutes}分)
                </option>
              ))}
            </select>
          </div>

          {/* 予約ボタン */}
          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedTime || !selectedMenuId}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? '予約中...' : '予約する'}
          </button>
        </form>
      </div>
    </div>
  )
}
