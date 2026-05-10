import NexusLogo from './shared/NexusLogo'
import { scoreBreakdown, isIssue } from '../lib/scoring'

const STATUS_CONFIG = {
  verified:     { label: 'Verified',           color: '#1A7F37', bg: '#DCFCE7', icon: '✓' },
  predatory:    { label: 'Predatory journal',   color: '#C8102E', bg: '#FEE2E2', icon: '⚠' },
  preprint:     { label: 'Unreviewed preprint', color: '#D97706', bg: '#FEF3C7', icon: '⚠' },
  inaccessible: { label: 'Not accessible',      color: '#7C3AED', bg: '#EDE9FE', icon: '🔒' },
  unverified:   { label: 'Possible hallucination', color: '#C8102E', bg: '#FEE2E2', icon: '✗' },
}

function CitationResult({ citation, flagged }) {
  const cfg = STATUS_CONFIG[citation.status]
  const shouldFlag = isIssue(citation.status)
  const correct = flagged === shouldFlag

  return (
    <div
      className="bg-white rounded-2xl p-5 border-2 transition-all"
      style={{ borderColor: cfg.color + '40' }}
    >
      <div className="flex items-start gap-4">

        {/* Citation number */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {citation.id}
        </div>

        <div className="flex-1 min-w-0">
          {/* Status badge */}
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
              style={{ background: cfg.bg, color: cfg.color }}
            >
              {cfg.icon} {cfg.label}
            </span>
            {shouldFlag && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: correct ? '#DCFCE7' : '#FEE2E2',
                  color: correct ? '#1A7F37' : '#C8102E',
                }}
              >
                {correct ? '✓ Correctly flagged' : flagged ? '✗ Missed — should flag' : '✗ Should have flagged'}
              </span>
            )}
            {!shouldFlag && flagged && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
                ✗ False flag (−50 pts)
              </span>
            )}
            {!shouldFlag && !flagged && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                ✓ Correctly left
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm font-medium leading-snug mb-1">{citation.title}</p>
          <p className="text-gray-400 text-xs truncate">{citation.authors} · {citation.journal} · {citation.year}</p>
        </div>
      </div>
    </div>
  )
}

export default function ResultsScreen({ session, onNext }) {
  const { scenario, flags, timeUsed } = session
  const flagSet = new Set(flags)
  const breakdown = scoreBreakdown({ citations: scenario.citations, flags, timeUsed })

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <NexusLogo size={30} />
          <span className="text-gray-700 font-semibold">Nexus Extend</span>
        </div>
        <h2 className="text-xl font-black text-gray-900">Your Results</h2>
        <div className="min-w-[100px]" />
      </div>

      {/* Two-column body — left scrolls, right is fixed-height CTA */}
      <div className="flex-1 min-h-0 flex">

        {/* Left column — score + citation breakdown (~60%) */}
        <div className="flex-[3] min-h-0 overflow-y-auto px-8 py-8 flex flex-col gap-6">

          {/* Score card */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-7">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-3">Your score</p>
            <div className="flex items-center justify-between gap-8 flex-wrap">
              <div>
                <p className="text-6xl font-black leading-none" style={{ color: '#5E33BF' }}>{breakdown.total}</p>
                <p className="text-gray-400 text-sm mt-1">points</p>
              </div>

              <div className="flex flex-col gap-2 flex-1 min-w-[240px]">
                <ScoreLine
                  label={`Suspicious citations caught: ${breakdown.correctlyFlagged} / 4`}
                  value={`+${breakdown.correctlyFlagged * 100}`}
                  positive
                />
                {breakdown.falseFlags > 0 && (
                  <ScoreLine
                    label={`False flags ×${breakdown.falseFlags}`}
                    value={`−${breakdown.falseFlags * 50}`}
                    negative
                  />
                )}
                {breakdown.timePenalty > 0 && (
                  <ScoreLine
                    label={`Time penalty (${session.timeUsed}s − 20s)`}
                    value={`−${breakdown.timePenalty}`}
                    negative
                  />
                )}
                <div className="h-px bg-gray-100 my-1" />
                <ScoreLine label="Total" value={breakdown.total} bold />
              </div>
            </div>
          </div>

          {/* Citation breakdown */}
          <h3 className="text-base font-black text-gray-700 uppercase tracking-wide px-1">Citation breakdown</h3>
          <div className="flex flex-col gap-3">
            {scenario.citations.map(c => (
              <CitationResult key={c.id} citation={c} flagged={flagSet.has(c.id)} />
            ))}
          </div>
        </div>

        {/* Right column — Nexus CTA, full height, never scrolls (~40%) */}
        <aside className="flex-[2] bg-[#5E33BF] flex flex-col items-center justify-center text-center px-10 py-10 text-white">
          <div className="max-w-md">
            <p className="text-[#C4B5F8] text-xs font-bold uppercase tracking-widest mb-4">Up next</p>
            <h3
              className="font-black leading-[1.1] tracking-tight mb-5"
              style={{ fontSize: 'clamp(28px, 2.4vw, 42px)' }}
            >
              Now see how Nexus Extend does it
            </h3>
            <p className="text-[#C4B5F8] text-lg leading-relaxed mb-8">
              Watch it verify the same citations automatically — in seconds.
            </p>
            <button
              onPointerDown={onNext}
              className="bg-white hover:bg-gray-100 active:scale-95 text-[#5E33BF] font-black text-xl px-12 py-5 rounded-2xl transition-all shadow-2xl whitespace-nowrap"
              style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.18)' }}
            >
              Watch it work →
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}

function ScoreLine({ label, value, positive, negative, bold }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className={`text-sm ${bold ? 'font-black text-gray-900' : 'text-gray-500'}`}>{label}</span>
      <span
        className={`text-sm font-bold tabular-nums ${
          positive ? 'text-green-600' : negative ? 'text-red-600' : bold ? 'text-gray-900 text-base' : 'text-gray-700'
        }`}
      >
        {value}
      </span>
    </div>
  )
}
