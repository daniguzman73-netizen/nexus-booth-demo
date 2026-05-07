import { useState, useEffect, useRef } from 'react'
import NexusLogo from './shared/NexusLogo'

// Status visuals — match the Nexus product styling in references/03 and 05/06.
const STATUS = {
  verified: {
    label: 'Verified',
    short: 'Verified',
    icon: '✓',
    color:   '#1A7F37',
    bg:      '#DCFCE7',
    border:  '#86EFAC',
    pillBg:  '#F0FDF4',
    pillBorder: '#BBF7D0',
    panelHeader: 'Available through your library',
    cta: 'View Full Article',
  },
  predatory: {
    label: 'Not verified — Predatory journal',
    short: 'Predatory',
    icon: '⚠',
    color:   '#C8102E',
    bg:      '#FEE2E2',
    border:  '#FCA5A5',
    pillBg:  '#FEF2F2',
    pillBorder: '#FECACA',
    panelHeader: 'This source could not be verified',
    cta: 'Find Verified Alternative',
  },
  preprint: {
    label: 'Not yet peer-reviewed',
    short: 'Preprint',
    icon: '⚠',
    color:   '#D97706',
    bg:      '#FEF3C7',
    border:  '#FCD34D',
    pillBg:  '#FFFBEB',
    pillBorder: '#FDE68A',
    panelHeader: 'Preprint — not yet peer-reviewed',
    cta: 'Find Peer-Reviewed Source',
  },
  inaccessible: {
    label: 'Verified — outside library entitlements',
    short: 'No access',
    icon: '🔒',
    color:   '#7C3AED',
    bg:      '#EDE9FE',
    border:  '#C4B5FD',
    pillBg:  '#F5F3FF',
    pillBorder: '#DDD6FE',
    panelHeader: 'Verified, but outside your library\'s entitlements',
    cta: 'Find Available Alternative',
  },
  unverified: {
    label: 'Could not be verified',
    short: 'Unverified',
    icon: '✗',
    color:   '#C8102E',
    bg:      '#FEE2E2',
    border:  '#FCA5A5',
    pillBg:  '#FEF2F2',
    pillBorder: '#FECACA',
    panelHeader: 'This source could not be verified in academic databases',
    cta: 'Find Verified Alternative',
  },
}

// ───────────────────────────────────────────────────────────────────────────
// Browser-style tab bar matching reference PNGs
// ───────────────────────────────────────────────────────────────────────────
function ChatTabs() {
  return (
    <div className="flex items-end gap-1 px-3 pt-2 bg-[#F3F4F6] border-b border-gray-200">
      <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-t-lg border border-b-0 border-gray-200 text-sm">
        <span className="w-4 h-4 rounded-full bg-[#10A37F] flex items-center justify-center text-white text-[10px] font-bold">G</span>
        <span className="text-gray-700">ChatGPT</span>
      </div>
      <div className="flex items-center gap-2 px-4 py-2 bg-[#F9F8FB] rounded-t-lg border border-b-0 border-gray-200 text-sm">
        <span className="text-[#5E33BF] text-xs">▥</span>
        <span className="text-gray-600">Nexus Setup</span>
      </div>
      <div className="flex items-center gap-1 px-3 py-2 bg-[#F9F8FB] rounded-t-lg border border-b-0 border-gray-200 text-sm">
        <span className="text-gray-400 text-xs">🧩</span>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Inline citation pill — author/year + status dot, click to open popup
// ───────────────────────────────────────────────────────────────────────────
function CitationPill({ citation, revealed, onClick }) {
  const status = STATUS[citation.status]
  const firstAuthor = citation.authors.split(',')[0].split('&')[0].trim()
  const isMulti = citation.authors.includes(',') || citation.authors.includes('&')
  const label = `${firstAuthor}${isMulti ? ' et al.' : ''}, ${citation.year}`

  if (!revealed) {
    return (
      <span className="inline-flex items-center gap-1 mx-0.5 align-baseline">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md border bg-white text-xs font-medium text-gray-500"
              style={{ borderColor: '#E5E7EB' }}>
          [{citation.id}]
        </span>
      </span>
    )
  }

  const ctaShort = citation.status === 'verified' ? 'Full Text' : 'View Page'

  return (
    <span className="inline-flex items-center gap-1 mx-0.5 align-baseline whitespace-nowrap">
      <button
        onPointerDown={onClick}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium hover:brightness-95 transition-all"
        style={{
          borderColor: status.pillBorder,
          background: status.pillBg,
          color: '#374151',
        }}
      >
        <span>{label}</span>
        <span
          className="w-3.5 h-3.5 rounded-full inline-flex items-center justify-center text-[8px] font-black flex-shrink-0"
          style={{ background: status.color, color: 'white' }}
        >
          {status.icon}
        </span>
      </button>
      <button
        onPointerDown={onClick}
        className="inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-semibold hover:bg-red-50 transition-all"
        style={{ borderColor: '#FCA5A5', color: '#C8102E', background: 'white' }}
      >
        {ctaShort}
      </button>
    </span>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Citation popup — appears when a pill or sidebar entry is tapped
// Mirrors PNG 05 (verified) and PNG 06 (unverified/predatory/etc.)
// ───────────────────────────────────────────────────────────────────────────
function CitationPopup({ citation, libName, onClose }) {
  const status = STATUS[citation.status]
  const isVerified = citation.status === 'verified'
  const hasAlternatives = citation.alternatives?.length > 0
  // Synthesize plausible bibliometric numbers for verified
  const cited = isVerified ? Math.floor(50 + (citation.id * 47) % 200) : null
  const refs  = isVerified ? Math.floor(20 + (citation.id * 31) % 80) : null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-fade-in"
      onPointerDown={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-slide-up"
        onPointerDown={e => e.stopPropagation()}
      >

        {/* Header — title + authors + close */}
        <div className="px-5 pt-5 pb-3 flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: status.bg, color: status.color, fontSize: 20 }}
          >
            {isVerified ? '📄' : status.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-snug mb-1">{citation.title}</p>
            <p className="text-xs text-gray-500 leading-snug">
              {citation.authors} ({citation.year})
            </p>
            <p className="text-xs text-gray-400 italic mt-0.5">{citation.journal}</p>
          </div>
          <button
            onPointerDown={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex-shrink-0 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Verified popup body */}
        {isVerified && (
          <>
            <div className="px-5 pb-4 flex items-center gap-4 text-xs text-gray-500 border-b border-gray-100">
              <span>📊 <strong className="text-gray-700">{cited}</strong> cited</span>
              <span>📚 <strong className="text-gray-700">{refs}</strong> refs</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-400">{citation.journal.split(' ').slice(0, 3).join(' ')}{citation.journal.split(' ').length > 3 ? '…' : ''} · {citation.year}</span>
            </div>

            <div className="px-5 py-4">
              <div
                className="rounded-lg border px-3 py-2 mb-3 flex items-center gap-2 text-xs font-semibold"
                style={{ background: status.bg, borderColor: status.border, color: status.color }}
              >
                <span className="w-4 h-4 rounded-full inline-flex items-center justify-center text-[10px]"
                      style={{ background: status.color, color: 'white' }}>{status.icon}</span>
                Available through {libName}
              </div>

              <button
                onPointerDown={() => {}}
                className="w-full bg-nexus-red hover:bg-nexus-red-dark active:scale-[0.99] text-white font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>📄</span> View Full Article
              </button>

              <div className="flex gap-3 mt-3 justify-center text-xs">
                <button className="text-gray-500 hover:text-gray-800 transition-colors px-3 py-1">Cite</button>
                <span className="text-gray-300">|</span>
                <button className="text-gray-500 hover:text-gray-800 transition-colors px-3 py-1">Save</button>
              </div>
            </div>
          </>
        )}

        {/* Unverified / predatory / preprint / inaccessible popup body */}
        {!isVerified && (
          <>
            <div className="px-5 pb-4 border-b border-gray-100">
              <div
                className="rounded-lg border px-3 py-2.5 flex items-start gap-2"
                style={{ background: status.bg, borderColor: status.border }}
              >
                <span className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[11px] font-black flex-shrink-0 mt-0.5"
                      style={{ background: status.color, color: 'white' }}>{status.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold mb-0.5" style={{ color: status.color }}>{status.short}</p>
                  <p className="text-xs leading-snug text-gray-700">{citation.nexus_message}</p>
                </div>
              </div>
            </div>

            {hasAlternatives && (
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                  ✓ Verified alternatives available
                </p>
                <div className="flex flex-col gap-2">
                  {citation.alternatives.map((alt, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs leading-snug">
                      <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">✓</span>
                      <span className="text-gray-700">{alt.display}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="px-5 py-4">
              <button
                onPointerDown={() => {}}
                className="w-full bg-nexus-red hover:bg-nexus-red-dark active:scale-[0.99] text-white font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>🔍</span> {status.cta}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Right sidebar — Nexus extension panel ("Sources Cited on Page" tab)
// ───────────────────────────────────────────────────────────────────────────
function NexusSidebar({ citations, scanning, libName, onCitationClick }) {
  const issueCount = citations.filter(c => c.status !== 'verified').length

  if (scanning) {
    return (
      <aside className="w-[380px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
        <SidebarHeader libName={libName} />

        <div className="px-4 py-6 flex flex-col items-center gap-4">
          <div
            className="w-full rounded-lg px-4 py-3 flex items-center gap-3"
            style={{ background: '#FEE2E2', border: '1px solid #FCA5A5' }}
          >
            <div className="w-8 h-8 rounded-md bg-nexus-red flex items-center justify-center flex-shrink-0">
              <ScanningSpinner />
            </div>
            <div className="flex-1">
              <p className="text-nexus-red text-sm font-bold">{citations.length} sources found</p>
              <p className="text-gray-600 text-xs">Click to verify…</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs italic px-4 text-center leading-relaxed">
            Checking against Web of Science and the Central Discovery Index…
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-[380px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
      <SidebarHeader libName={libName} />

      {/* Tabs */}
      <div className="grid grid-cols-2 gap-2 px-3 pt-3">
        <button className="px-3 py-2 rounded-md bg-nexus-red text-white text-xs font-bold">
          Sources Cited on Page
        </button>
        <button className="px-3 py-2 rounded-md bg-gray-100 text-gray-500 text-xs font-semibold">
          Related Scholarly Sources
        </button>
      </div>

      {/* Verify summary */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-900">Verify Sources Cited by ChatGPT</p>
          <span className="text-xs font-semibold text-gray-500">{issueCount} Detected</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-snug">
          ChatGPT may not always be right. Even if it cites verified sources, double-check claims for accuracy.
        </p>
        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-600">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1A7F37]" />
            <strong>{citations.length - issueCount}</strong> verified
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C8102E]" />
            <strong>{issueCount}</strong> unverified
          </span>
        </div>
      </div>

      {/* Citation list */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-2">
        {citations.map(c => {
          const status = STATUS[c.status]
          return (
            <button
              key={c.id}
              onPointerDown={() => onCitationClick(c)}
              className="text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.99] transition-all"
            >
              <div className="flex items-start gap-2.5">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
                    {c.title}
                  </p>
                  <p className="text-[10px] text-gray-500 leading-snug truncate">
                    {c.authors.split(',').slice(0, 2).join(',')}{c.authors.split(',').length > 2 ? ', et al.' : ''} ({c.year})
                  </p>
                  <p className="text-[10px] text-gray-400 italic truncate">
                    {c.status === 'verified' ? 'ARTICLE' : c.status.toUpperCase()}
                  </p>
                </div>

                {/* Status icon */}
                <span
                  className="w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black flex-shrink-0"
                  style={{ background: status.bg, color: status.color }}
                  title={status.label}
                >
                  {status.icon}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Library footer strip */}
      <div className="bg-nexus-red text-white px-4 py-2 flex items-center gap-2">
        <span className="text-[10px]">▥</span>
        <span className="text-xs font-bold uppercase tracking-wide">{libName}</span>
      </div>
    </aside>
  )
}

function SidebarHeader({ libName }) {
  return (
    <div className="bg-nexus-red text-white px-4 py-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-black">▥</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold leading-tight">{libName}</p>
        <p className="text-[11px] text-white/80 leading-tight">Nexus Academic Assistant</p>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button className="w-6 h-6 rounded hover:bg-white/15 flex items-center justify-center text-[11px]" aria-label="Edit">✎</button>
        <button className="w-6 h-6 rounded hover:bg-white/15 flex items-center justify-center text-[11px]" aria-label="Expand">⤢</button>
      </div>
    </div>
  )
}

function ScanningSpinner() {
  return (
    <svg width="16" height="16" viewBox="0 0 36 36" className="animate-spin">
      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
      <path d="M 18 4 A 14 14 0 0 1 32 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Parse AI response and intersperse <CitationPill> components for [N] markers
// ───────────────────────────────────────────────────────────────────────────
function renderResponse(text, citationsById, revealed, onPillClick) {
  const parts = text.split(/(\[\d+\])/g)
  return parts.map((part, i) => {
    const m = part.match(/^\[(\d+)\]$/)
    if (!m) return <span key={i}>{part}</span>
    const id = parseInt(m[1])
    const citation = citationsById[id]
    if (!citation) return <span key={i}>{part}</span>
    return (
      <CitationPill
        key={i}
        citation={citation}
        revealed={revealed}
        onClick={() => onPillClick(citation)}
      />
    )
  })
}

// ───────────────────────────────────────────────────────────────────────────
// Main component
// ───────────────────────────────────────────────────────────────────────────
export default function NexusRevealScreen({ session, onNext }) {
  const { scenario, institution } = session
  const [scanning, setScanning] = useState(true)
  const [active, setActive] = useState(null) // active citation (popup)

  const libName = institution
    ? institution.split(',')[0].replace(/\s+(Libraries?|Library System?|Librar\w*)$/i, '') + ' Library'
    : 'Your Library'

  const citationsById = scenario.citations.reduce((acc, c) => { acc[c.id] = c; return acc }, {})

  useEffect(() => {
    const id = setTimeout(() => setScanning(false), 1800)
    return () => clearTimeout(id)
  }, [])

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Booth top bar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <NexusLogo size={28} />
          <span className="text-gray-700 font-semibold">Nexus Extend</span>
        </div>
        <h2 className="text-lg font-black text-gray-900">Now, watch Nexus do it</h2>
        <button
          onPointerDown={onNext}
          disabled={scanning}
          className="bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all disabled:opacity-40 touch-target"
        >
          Continue →
        </button>
      </div>

      {/* Scan banner */}
      <div
        className="px-8 py-3 text-center text-sm font-medium transition-all"
        style={{
          background: scanning ? '#FEE2E2' : '#DCFCE7',
          color:      scanning ? '#C8102E' : '#1A7F37',
        }}
      >
        {scanning
          ? '● Nexus is scanning citations against Web of Science and the Central Discovery Index…'
          : `✓ Scan complete — ${scenario.citations.filter(c => c.status !== 'verified').length} issues found across ${scenario.citations.length} citations, in under 2 seconds`
        }
      </div>

      {/* Live Nexus mockup */}
      <div className="flex-1 px-8 py-6">
        <div className="max-w-[1280px] mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

          <ChatTabs />

          <div className="flex" style={{ minHeight: 540 }}>

            {/* Chat panel */}
            <div className="flex-1 px-8 py-6 overflow-hidden">

              {/* User message */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[#5E33BF] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  U
                </div>
                <p className="text-gray-800 text-base leading-relaxed font-medium pt-0.5">
                  {scenario.question}
                </p>
              </div>

              {/* AI message */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#10A37F] flex items-center justify-center text-white text-[10px] font-black flex-shrink-0">
                  G
                </div>
                <div className="flex-1 text-gray-800 text-[15px] leading-[1.85] whitespace-pre-line">
                  {renderResponse(scenario.ai_response, citationsById, !scanning, c => setActive(c))}
                </div>
              </div>

              {/* Composer (decorative) */}
              <div className="mt-8 bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 text-gray-400 text-sm">
                <span className="flex-1">Send a message…</span>
                <span className="text-xl">⏵</span>
              </div>
            </div>

            {/* Sidebar */}
            <NexusSidebar
              citations={scenario.citations}
              scanning={scanning}
              libName={libName}
              onCitationClick={c => setActive(c)}
            />
          </div>
        </div>

        {/* Helper hint */}
        {!scanning && !active && (
          <p className="text-center text-gray-500 text-sm mt-5 animate-fade-in">
            💡 Tap any citation to see how Nexus verified it.
          </p>
        )}
      </div>

      {/* Citation popup */}
      {active && (
        <CitationPopup
          citation={active}
          libName={libName}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}
