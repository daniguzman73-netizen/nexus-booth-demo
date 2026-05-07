import { useEffect, useState } from 'react'
import NexusLogo from './shared/NexusLogo'

const TICKER_ENTRIES = [
  { name: 'Priya M.',    institution: 'U of Michigan',    score: 347 },
  { name: 'David K.',    institution: 'Yale Library',      score: 312 },
  { name: 'Sarah L.',    institution: 'UT Austin',         score: 298 },
  { name: 'Marcus T.',   institution: 'Stanford',          score: 285 },
  { name: 'Ayesha R.',   institution: 'NYU Libraries',     score: 271 },
  { name: 'James W.',    institution: 'UNC Chapel Hill',   score: 259 },
]

export default function WelcomeScreen({ onStart }) {
  const [tickIdx, setTickIdx] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTickIdx(i => (i + 1) % TICKER_ENTRIES.length), 4000)
    return () => clearInterval(id)
  }, [])

  const entry = TICKER_ENTRIES[tickIdx]

  return (
    <div className="relative kiosk-full bg-[#F3F4F6] flex flex-col overflow-x-hidden">

      {/* ── Background orbs ─────────────────────────────────────── */}
      <div
        className="absolute pointer-events-none animate-float-a"
        style={{
          width: 760, height: 760,
          top: '-18%', left: '-8%',
          background: 'radial-gradient(circle, rgba(94,51,191,0.10) 0%, transparent 65%)',
          borderRadius: '50%',
        }}
      />
      <div
        className="absolute pointer-events-none animate-float-b"
        style={{
          width: 540, height: 540,
          bottom: '0%', right: '-4%',
          background: 'radial-gradient(circle, rgba(94,51,191,0.08) 0%, transparent 65%)',
          borderRadius: '50%',
          animationDelay: '-2s',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 360, height: 360,
          top: '35%', right: '18%',
          background: 'radial-gradient(circle, rgba(22,171,3,0.06) 0%, transparent 65%)',
          borderRadius: '50%',
        }}
      />

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="relative z-10 flex items-center justify-between px-12 pt-10 pb-0">
        {/* Nexus branding */}
        <div className="flex items-center gap-4">
          <NexusLogo size={48} />
          <div>
            <div className="text-gray-900 font-bold text-xl tracking-tight leading-tight">Nexus Extend</div>
            <div className="text-gray-500 text-sm tracking-wide">by Clarivate</div>
          </div>
        </div>

        {/* Conference badge */}
        <div className="flex items-center gap-3 border border-[#5E33BF]/30 bg-[#5E33BF]/8 rounded-xl px-5 py-2.5">
          <span className="text-[#5E33BF] text-sm font-semibold tracking-widest uppercase">ALA 2026</span>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-16">

        {/* Tag line */}
        <div className="mb-6 px-5 py-2 rounded-full border border-[#5E33BF]/35 bg-[#5E33BF]/12 inline-flex items-center">
          <span className="text-[#5E33BF] text-base font-semibold tracking-widest uppercase">
            Research Citation Challenge
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-black text-gray-900 leading-none tracking-tight mb-6"
          style={{ fontSize: 'clamp(72px, 7.5vw, 118px)' }}
        >
          Spot the Issues!
        </h1>

        {/* Sub-headline */}
        <p className="text-[1.6rem] text-gray-500 mb-14 leading-relaxed max-w-2xl">
          Can you catch what AI gets wrong about citations?
        </p>
        {/* CTA */}
        <button
          onPointerDown={onStart}
          className="bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-black tracking-wide rounded-2xl shadow-2xl transition-all duration-100 select-none"
          style={{ fontSize: 28, paddingLeft: 88, paddingRight: 88, paddingTop: 28, paddingBottom: 28, boxShadow: '0 20px 60px rgba(94,51,191,0.45)' }}
        >
          TAP TO START →
        </button>

        {/* Stats row */}
        <div className="mt-9 flex items-center gap-7 text-gray-600 text-lg">
          <span>⏱ 60 seconds</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>📄 5 citations to check</span>
          <span className="w-1 h-1 rounded-full bg-gray-700" />
          <span>🏆 Score on the leaderboard</span>
        </div>
      </div>

      {/* ── Bottom ticker ───────────────────────────────────────── */}
      <div className="relative z-10 bg-white border-t border-gray-200">
        <div className="flex items-center gap-4 px-10 py-4">
          <span className="text-gray-500 text-sm font-semibold uppercase tracking-widest whitespace-nowrap flex-shrink-0">
            🏆 Today's Leader
          </span>
          <span className="w-px h-5 bg-gray-200 flex-shrink-0" />

          <div className="flex-1 overflow-hidden">
            <span key={tickIdx} className="inline-block text-gray-500 text-base animate-fade-in">
              <span className="text-gray-900 font-semibold">{entry.name}</span>
              {' '}from{' '}
              <span className="text-gray-700">{entry.institution}</span>
              {' — '}
              <span className="text-[#16AB03] font-bold">{entry.score} pts</span>
            </span>
          </div>

          {/* Dots */}
          <div className="flex-shrink-0 flex items-center gap-1.5">
            {TICKER_ENTRIES.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  i === tickIdx ? 'bg-[#5E33BF]' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
