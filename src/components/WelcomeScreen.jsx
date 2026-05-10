import { useEffect, useRef, useState } from 'react'
import NexusLogo from './shared/NexusLogo'
import AdminPanel from './AdminPanel'
import { getTopEntries } from '../lib/leaderboard'

// Strip "Library, City, ST" suffixes so the ticker reads cleanly.
function shortInstitution(s) {
  if (!s) return ''
  return s.split(',')[0].trim()
}

export default function WelcomeScreen({ onStart }) {
  // Pull real entries from the local leaderboard on mount. Empty until the
  // first player submits their score (no fake names, no seed data).
  const [entries, setEntries] = useState(() => getTopEntries(3))
  const [tickIdx, setTickIdx] = useState(0)

  // Hidden admin gesture: 5 rapid taps on the Nexus Extend logo.
  // Taps reset if more than 800ms elapses between them.
  const [adminOpen, setAdminOpen] = useState(false)
  const tapsRef = useRef([])

  function handleLogoTap() {
    const now = Date.now()
    tapsRef.current = tapsRef.current.filter(t => now - t < 800)
    tapsRef.current.push(now)
    if (tapsRef.current.length >= 5) {
      tapsRef.current = []
      setAdminOpen(true)
    }
  }

  useEffect(() => {
    if (entries.length <= 1) return
    const id = setInterval(() => setTickIdx(i => (i + 1) % entries.length), 5000)
    return () => clearInterval(id)
  }, [entries.length])

  const entry = entries[tickIdx]
  const rank  = tickIdx + 1
  const inst  = shortInstitution(entry?.institution)

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
        {/* Nexus branding — 5 rapid taps on the logo opens the admin panel */}
        <div
          className="flex items-center gap-4 cursor-pointer select-none"
          onPointerDown={handleLogoTap}
        >
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

        {/* Headline — always one line at 1280px+ */}
        <h1
          className="font-black text-gray-900 leading-[1.05] tracking-tight mb-8 whitespace-nowrap"
          style={{ fontSize: 'clamp(56px, 5.6vw, 108px)' }}
        >
          "AI can make mistakes."
        </h1>

        {/* Sub-headline — single line from 1280px to 1920px */}
        <p
          className="text-gray-500 mb-16 leading-relaxed whitespace-nowrap"
          style={{ fontSize: 'clamp(20px, 1.5vw, 26px)' }}
        >
          Nexus Extend verifies every citation against trusted academic sources.
        </p>

        {/* CTA — width scales with content; nowrap keeps the label on one line */}
        <button
          onPointerDown={onStart}
          className="bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-black tracking-wide rounded-2xl shadow-2xl transition-all duration-100 select-none whitespace-nowrap"
          style={{ fontSize: 28, paddingLeft: 80, paddingRight: 80, paddingTop: 28, paddingBottom: 28, boxShadow: '0 20px 60px rgba(94,51,191,0.45)' }}
        >
          Can you spot the bad citations? →
        </button>

        {/* Stats row */}
        <div className="mt-10 flex items-center gap-7 text-gray-600 text-lg">
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
            🏆 Today's Leaderboard
          </span>
          <span className="w-px h-5 bg-gray-200 flex-shrink-0" />

          <div className="flex-1 overflow-hidden">
            {entries.length === 0 ? (
              <span className="inline-block text-gray-500 text-base">
                🏆 Be the first on today's leaderboard
              </span>
            ) : (
              <span key={tickIdx} className="inline-block text-gray-500 text-base animate-fade-in">
                <span className="text-gray-700 font-bold">🏆 #{rank}</span>
                {' '}
                <span className="text-gray-900 font-semibold">{entry.name}</span>
                {inst && <>{' '}from{' '}<span className="text-gray-700">{inst}</span></>}
                {' — '}
                <span className="text-[#16AB03] font-bold">{entry.score} pts</span>
              </span>
            )}
          </div>

          {/* Dots — only when rotating through more than one entry */}
          {entries.length > 1 && (
            <div className="flex-shrink-0 flex items-center gap-1.5">
              {entries.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    i === tickIdx ? 'bg-[#5E33BF]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Admin panel — opened via 5 rapid taps on the Nexus Extend logo */}
      {adminOpen && <AdminPanel onClose={() => setAdminOpen(false)} />}
    </div>
  )
}
