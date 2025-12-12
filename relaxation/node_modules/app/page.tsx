'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ナビゲーション */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ToS Relaxation</h1>
          <div className="space-x-4">
            <Link href="/therapists" className="text-gray-600 hover:text-blue-600">
              施術者を探す
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero セクション */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-6">プロフェッショナルなマッサージサービス</h2>
        <p className="text-lg text-gray-600 mb-8">
          経験豊富な施術者があなたの疲れを癒します
        </p>
        <Link
          href="/therapists"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          施術者を探す
        </Link>
      </section>
    </div>
  )
}
