'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Member {
  id: string
  name: string
  age: number
  height: number
  weight: number
  residence: string
  dispatch_status: string
  qualification: string
  other_services: string
  appeal_comment: string
  thumbnail_image?: string
}

interface Props {
  member: Member
  onClose: () => void
}

export default function MemberModal({ member, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold">{member.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {/* コンテンツ */}
        <div className="p-6 space-y-6">
          {/* 写真 */}
          {member.thumbnail_image && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden">
              <Image
                src={member.thumbnail_image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* 基本情報 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm">年齢</p>
              <p className="text-lg font-semibold">{member.age}歳</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">身長</p>
              <p className="text-lg font-semibold">{member.height}cm</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">体重</p>
              <p className="text-lg font-semibold">{member.weight}kg</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">居住地</p>
              <p className="text-lg font-semibold">{member.residence}</p>
            </div>
          </div>

          {/* その他情報 */}
          <div>
            <p className="text-gray-600 text-sm">出張対応</p>
            <p className="text-lg">{member.dispatch_status}</p>
          </div>

          <div>
            <p className="text-gray-600 text-sm">資格</p>
            <p className="text-lg">{member.qualification}</p>
          </div>

          {member.other_services && (
            <div>
              <p className="text-gray-600 text-sm">その他サービス</p>
              <p className="text-lg">{member.other_services}</p>
            </div>
          )}

          <div>
            <p className="text-gray-600 text-sm">アピール</p>
            <p className="text-lg">{member.appeal_comment}</p>
          </div>

          {/* 予約ボタン */}
          <Link
            href={`/booking?member_id=${member.id}`}
            className="block w-full bg-blue-600 text-white py-3 rounded-lg text-center font-semibold hover:bg-blue-700 transition"
          >
            予約する
          </Link>
        </div>
      </div>
    </div>
  )
}
