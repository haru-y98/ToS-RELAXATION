'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import MemberModal from '@/components/MemberModal'

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
  thumbnail_image?: string
  internal_status: string
  appeal_comment: string
}

export default function TherapistsPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/members')
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-20">読み込み中...</div>

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-12">施術者一覧</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((member) => (
            <div
              key={member.id}
              onClick={() => setSelectedMember(member)}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-lg transition cursor-pointer"
            >
              <div className="relative w-full h-48 bg-gray-200">
                {member.thumbnail_image ? (
                  <Image
                    src={member.thumbnail_image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-300 text-gray-600">
                    No Image
                  </div>
                )}
                {member.internal_status === 'NEW' && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded text-sm">
                    NEW
                  </span>
                )}
                {member.internal_status === '人気' && (
                  <span className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded text-sm">
                    人気
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{member.name}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{member.appeal_comment}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* モーダル */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  )
}
