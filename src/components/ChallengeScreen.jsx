import { useState, useCallback } from 'react'
import Timer from './shared/Timer'

function parseResponse(text) {
  return text.split(/(\[\d+\])/).map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) return { type: 'ref', num: parseInt(match[1]), key: i }
    return { type: 'text', content: part, key: i }
  })
}

function TimerRing({ seconds, total = 60 }) {
  const pct = seconds / total
  const r = 26
  const circ = 2 * Math.PI * r
  const urgent = seconds <= 10
  const color = urgent ? '#C8102E' : '#5E33BF'

  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="80" height="80" className="-rotate-90" style={{ position: 'absolute' }}>
        <circle cx="40" cy="40" r={r} fill="none" stroke="#E5E7EB" strokeWidth="5" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className="text-2xl font-black tabular-nums"
        style={{ color, zIndex: 1 }}
      >
        {seconds}
      </span>
    </div>
  )
}

function FieldRow({ label, value, mono }) {
  const empty = value == null || value === ''
  return (
    <div className="flex items-baseline gap-2 min-w-0">
      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest flex-shrink-0 w-[68px]">
        {label}
      </span>
      <span
        className={`text-gray-700 text-xs leading-snug min-w-0 flex-1 ${mono ? 'font-mono' : ''} ${empty ? 'italic text-gray-400' : ''}`}
        style={{ wordBreak: 'break-word' }}
      >
        {empty ? 'Not provided' : value}
      </span>
    </div>
  )
}

function CitationCard({ citation, flagged, onToggle }) {
  const isFlagged = flagged

  return (
    <div
      className="w-full rounded-2xl border-2 transition-all duration-150 select-none overflow-hidden"
      style={{
        background: isFlagged ? 'rgba(200,16,46,0.04)' : 'white',
        borderColor: isFlagged ? '#C8102E' : '#E5E7EB',
        boxShadow: isFlagged
          ? '0 4px 16px rgba(200,16,46,0.12)'
          : '0 1px 3px rgba(0,0,0,0.06)',
      }}
    >
      {/* Header — citation number + flag button */}
      <div
        className="flex items-center justify-between gap-3 px-4 py-2.5 border-b"
        style={{
          background: isFlagged ? 'rgba(200,16,46,0.06)' : '#FAFAFA',
          borderColor: isFlagged ? 'rgba(200,16,46,0.18)' : '#F3F4F6',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-white"
            style={{ background: isFlagged ? '#C8102E' : '#9CA3AF' }}
          >
            {citation.id}
          </span>
          <span className="text-gray-500 text-xs font-semibold uppercase tracking-widest">
            Citation [{citation.id}]
          </span>
        </div>

        <button
          onPointerDown={onToggle}
          className="flex items-center gap-2 rounded-lg px-3 py-1.5 transition-all touch-target"
          style={{
            background: isFlagged ? '#C8102E' : '#F3F4F6',
            color: isFlagged ? 'white' : '#6B7280',
          }}
        >
          <span className="text-base leading-none">🚩</span>
          <span className="text-xs font-bold whitespace-nowrap">
            {isFlagged ? 'FLAGGED' : 'FLAG'}
          </span>
        </button>
      </div>

      {/* Body — structured citation fields */}
      <div className="px-4 py-3 flex flex-col gap-1.5">
        <FieldRow label="Authors" value={citation.authors} />
        <FieldRow label="Title"   value={citation.title} />

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <FieldRow label="Journal" value={citation.journal} />
          <FieldRow label="Year"    value={citation.year} />
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <FieldRow label="Vol/Issue" value={citation.volume_issue} />
          <FieldRow label="DOI"       value={citation.doi} mono />
        </div>
      </div>
    </div>
  )
}

export default function ChallengeScreen({ session, onSubmit }) {
  const { scenario } = session
  const [flags, setFlags] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(60)
  const [elapsed, setElapsed] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const parts = parseResponse(scenario.ai_response)

  const toggleFlag = useCallback((id) => {
    setFlags(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  function handleSubmit() {
    if (submitted) return
    setSubmitted(true)
    onSubmit({ flags: [...flags], timeUsed: elapsed })
  }

  function handleTick(s) {
    setTimeLeft(s)
    setElapsed(60 - s)
    if (s <= 0 && !submitted) handleSubmit()
  }

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Single scroll context for the whole screen — sticky top bar lives
          inside it so the timer stays visible during scroll. */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col">

      {/* Top bar — sticky, minimalist: timer + submit only (no chrome) */}
      <div className="sticky top-0 z-20 flex-shrink-0 flex items-center justify-end gap-4 px-8 py-4 bg-white border-b border-gray-100 shadow-sm">
        <TimerRing seconds={timeLeft} />
        <button
          onPointerDown={handleSubmit}
          disabled={submitted}
          className="bg-nexus-red hover:bg-nexus-red-dark active:scale-95 text-white font-bold text-base px-7 py-3 rounded-xl transition-all disabled:opacity-50 touch-target"
        >
          Submit →
        </button>
      </div>

      <Timer running={!submitted} onTick={handleTick} onExpire={handleSubmit} seconds={60} />

      {/* Body — two columns, natural page scroll */}
      <div className="flex">

        {/* Left: AI response */}
        <div className="flex-[3] px-8 py-6">
          <div className="max-w-2xl mx-auto">

            {/* AI assistant header */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-[#5E33BF]/15 flex items-center justify-center">
                <span className="text-xl">🤖</span>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">AI Chatbot</p>
                <p className="text-gray-400 text-xs">Generated response — verify before use</p>
              </div>
            </div>

            {/* Chat bubble */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-8 py-7">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-4">Research question</p>
              <p className="text-gray-700 font-medium mb-5 text-base">{scenario.question}</p>
              <div className="h-px bg-gray-100 mb-5" />

              {/* Response text with inline refs */}
              <div className="text-gray-800 text-[1.02rem] leading-[1.8] whitespace-pre-line">
                {parts.map(part => {
                  if (part.type === 'ref') {
                    const isFlagged = flags.has(part.num)
                    return (
                      <button
                        key={part.key}
                        onPointerDown={() => toggleFlag(part.num)}
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold mx-0.5 align-super transition-all"
                        style={{
                          background: isFlagged ? '#C8102E' : '#5E33BF',
                          color: 'white',
                          transform: 'translateY(-2px)',
                          fontSize: '0.7rem',
                        }}
                      >
                        {part.num}
                      </button>
                    )
                  }
                  return <span key={part.key}>{part.content}</span>
                })}
              </div>
            </div>

            <p className="mt-4 text-gray-400 text-xs text-center">
              👇 Tap the flag next to any citation that looks suspicious
            </p>
          </div>
        </div>

        {/* Right: citation cards */}
        <div className="flex-[2] px-5 py-6 border-l border-gray-200 bg-[#F3F4F6]">
          <div className="flex flex-col gap-3">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1 px-1">
              Citations — flag any that look suspicious
            </p>
            {scenario.citations.map(c => (
              <CitationCard
                key={c.id}
                citation={c}
                flagged={flags.has(c.id)}
                onToggle={() => toggleFlag(c.id)}
              />
            ))}
          </div>

          {/* Flagged summary */}
          {flags.size > 0 && (
            <div className="mt-4 bg-nexus-red/8 rounded-2xl px-5 py-4 border border-nexus-red/20">
              <p className="text-nexus-red font-semibold text-sm">
                🚩 {flags.size} citation{flags.size > 1 ? 's' : ''} flagged
              </p>
            </div>
          )}
        </div>
      </div>
      {/* /inner scroll container */}
      </div>
    </div>
  )
}
