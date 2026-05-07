import { useState, useEffect } from 'react'
import NexusLogo from './shared/NexusLogo'
import { getTopEntries } from '../lib/leaderboard'

const RESET_SECONDS = 15

export default function FinalScreen({ session, onReset }) {
  const [countdown, setCountdown] = useState(RESET_SECONDS)
  const top = getTopEntries(8)

  useEffect(() => {
    if (countdown <= 0) { onReset(); return }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown, onReset])

  const rank = session.rank ?? null

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <NexusLogo size={30} />
          <span className="text-gray-700 font-semibold">Nexus Extend</span>
        </div>
        <h2 className="text-xl font-black text-gray-900">🏆 Leaderboard</h2>
        <button
          onPointerDown={onReset}
          className="text-gray-400 hover:text-gray-700 font-medium text-sm transition-colors touch-target"
        >
          Play again →
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-8">
        <div className="max-w-4xl mx-auto flex flex-col gap-6 lg:flex-row">

          {/* Left: score + CTA */}
          <div className="flex flex-col gap-5 lg:w-80 flex-shrink-0">

            {/* Score hero */}
            <div className="bg-[#5E33BF] rounded-3xl p-7 text-white text-center">
              {rank && (
                <div className="mb-2">
                  <span className="text-[#C4B5F8] text-sm font-semibold">You ranked</span>
                  <p className="text-6xl font-black">#{rank}</p>
                  <p className="text-[#C4B5F8] text-sm">on the leaderboard</p>
                </div>
              )}
              <div className={rank ? 'mt-4 pt-4 border-t border-white/20' : ''}>
                <p className="text-[#C4B5F8] text-sm font-semibold">Score</p>
                <p className="text-4xl font-black">{session.score}</p>
                <p className="text-[#C4B5F8] text-xs mt-1">pts · {session.discipline?.icon} {session.discipline?.name}</p>
              </div>
            </div>

            {/* QR code placeholder */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center gap-4">
              <div
                className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center"
                style={{ border: '2px dashed #D1D5DB' }}
              >
                <span className="text-4xl">📱</span>
              </div>
              <p className="text-center text-sm text-gray-500 leading-relaxed">
                Scan to learn more about<br />
                <strong className="text-gray-800">Nexus Extend</strong> for your library
              </p>
              <div className="w-full bg-[#5E33BF]/8 rounded-xl px-4 py-2 text-center">
                <p className="text-[#5E33BF] text-xs font-semibold">clarivate.com/nexus-extend</p>
              </div>
            </div>

            {/* Auto-reset */}
            <div className="text-center">
              <p className="text-gray-400 text-sm">
                New game starts in <span className="font-bold text-gray-600">{countdown}s</span>
              </p>
              <button
                onPointerDown={onReset}
                className="mt-3 w-full bg-gray-800 hover:bg-gray-900 active:scale-[0.99] text-white font-bold text-lg py-5 rounded-2xl transition-all touch-target"
              >
                Play Again →
              </button>
            </div>
          </div>

          {/* Right: leaderboard */}
          <div className="flex-1 flex flex-col gap-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest px-1">Today's top scores</p>
            {top.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-base">
                No entries yet — you could be first! 🏆
              </div>
            )}
            {top.map((entry, i) => {
              const isCurrentUser = session.entry && entry.id === session.entry.id
              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-2xl px-6 py-4 border-2 shadow-sm flex items-center gap-4 transition-all"
                  style={{
                    borderColor: isCurrentUser ? '#5E33BF' : 'transparent',
                    background: isCurrentUser ? '#5E33BF08' : 'white',
                  }}
                >
                  {/* Rank */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
                    style={{
                      background: i === 0 ? '#FEF3C7' : i === 1 ? '#F3F4F6' : i === 2 ? '#FEF3C7' : '#F9FAFB',
                      color: i === 0 ? '#D97706' : i === 1 ? '#6B7280' : i === 2 ? '#92400E' : '#9CA3AF',
                    }}
                  >
                    {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                  </div>

                  {/* Name + institution */}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-base truncate">
                      {entry.name}
                      {isCurrentUser && (
                        <span className="ml-2 text-xs font-semibold text-[#5E33BF] bg-[#5E33BF]/10 px-2 py-0.5 rounded-full">You</span>
                      )}
                    </p>
                    {entry.institution && (
                      <p className="text-gray-400 text-xs truncate">{entry.institution.split(',')[0]}</p>
                    )}
                  </div>

                  {/* Discipline */}
                  <p className="text-gray-400 text-xs flex-shrink-0 hidden sm:block">{entry.discipline}</p>

                  {/* Score */}
                  <p
                    className="font-black text-lg flex-shrink-0 tabular-nums"
                    style={{ color: isCurrentUser ? '#5E33BF' : '#16AB03' }}
                  >
                    {entry.score}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
