import { useState, useEffect } from 'react'
import NexusLogo from './shared/NexusLogo'

// ───────────────────────────────────────────────────────────────────────────
// Status visuals — match SPEC §7 for the new Nexus design
// ───────────────────────────────────────────────────────────────────────────
const STATUS = {
  verified: {
    label: 'Verified',
    short: 'Verified',
    icon: '✅',
    color:   '#1A7F37',
    bg:      '#DCFCE7',
    border:  '#86EFAC',
    pillBg:  '#F0FDF4',
    pillBorder: '#BBF7D0',
  },
  predatory: {
    label: 'Unverified',
    short: 'Unverified',
    icon: '⚠️',
    color:   '#D97706',
    bg:      '#FEF3C7',
    border:  '#FCD34D',
    pillBg:  '#FFFBEB',
    pillBorder: '#FDE68A',
  },
  preprint: {
    label: 'Unverified',
    short: 'Unverified',
    icon: '⚠️',
    color:   '#D97706',
    bg:      '#FEF3C7',
    border:  '#FCD34D',
    pillBg:  '#FFFBEB',
    pillBorder: '#FDE68A',
  },
  inaccessible: {
    label: 'Paywalled',
    short: 'Paywalled',
    icon: '🔒',
    color:   '#6B7280',
    bg:      '#F3F4F6',
    border:  '#D1D5DB',
    pillBg:  '#F9FAFB',
    pillBorder: '#E5E7EB',
  },
  unverified: {
    label: 'Unverified',
    short: 'Unverified',
    icon: '❌',
    color:   '#C8102E',
    bg:      '#FEE2E2',
    border:  '#FCA5A5',
    pillBg:  '#FEF2F2',
    pillBorder: '#FECACA',
  },
  retracted: {
    label: 'Retracted',
    short: 'Retracted',
    icon: '🚫',
    color:   '#9D174D',
    bg:      '#FCE7F3',
    border:  '#F9A8D4',
    pillBg:  '#FDF2F8',
    pillBorder: '#FBCFE8',
  },
}

// Per-status copy for the citation-popup warning box (non-verified statuses).
const POPUP_HEADLINES = {
  predatory:    'Source not verified.',
  preprint:     'Not yet peer-reviewed.',
  inaccessible: 'Outside library entitlements.',
  unverified:   'Source not verified.',
  retracted:    'Paper retracted.',
}
const POPUP_BODIES = {
  predatory:    'This journal is not indexed in major academic databases and may not meet peer-review standards. Always verify sources before citing them.',
  preprint:     'This is a preprint — not yet peer-reviewed. Treat findings as preliminary until they appear in a peer-reviewed venue.',
  inaccessible: 'This source is verified but may not be available through your library entitlements. Look for an accessible alternative.',
  unverified:   'This source could not be verified in academic databases and may not exist or meet academic research standards. Always verify sources before citing them.',
  retracted:    'This paper has been retracted by the publisher. Web of Science tracks retractions so you can avoid citing withdrawn research. Use a verified alternative.',
}

// ───────────────────────────────────────────────────────────────────────────
// Top chrome — only ChatGPT tab + extension puzzle icon (no "Nexus Setup")
// ───────────────────────────────────────────────────────────────────────────
function ChatTabs() {
  return (
    <div className="flex items-end justify-between px-3 pt-2 bg-[#F3F4F6] border-b border-gray-200">
      <div className="flex items-end gap-1">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-t-lg border border-b-0 border-gray-200 text-sm">
          <span className="w-4 h-4 rounded-full bg-[#10A37F] flex items-center justify-center text-white text-[10px] font-bold">G</span>
          <span className="text-gray-700">ChatGPT</span>
        </div>
      </div>
      <div className="pb-1.5 pr-2">
        <button className="w-7 h-7 rounded hover:bg-gray-200 flex items-center justify-center text-gray-500" aria-label="Extensions">
          🧩
        </button>
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Avatars — purple person (user), green sparkles (AI)
// ───────────────────────────────────────────────────────────────────────────
function UserAvatar() {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#5E33BF] flex items-center justify-center flex-shrink-0">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    </div>
  )
}

function AIAvatar() {
  return (
    <div className="w-10 h-10 rounded-lg bg-[#10A37F] flex items-center justify-center flex-shrink-0 text-xl leading-none">
      ✨
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Inline citation pill — author/year + Full Text/View Page pill
//   - During scanning: plain `[N]` markers (no status icon)
//   - After reveal: author/year pill with embedded status icon
// ───────────────────────────────────────────────────────────────────────────
function CitationPill({ citation, revealed, onClick }) {
  const status = STATUS[citation.status]
  const firstAuthor = citation.authors.split(',')[0].split('&')[0].trim()
  const isMulti = citation.authors.includes(',') || citation.authors.includes('&')
  const label = `${firstAuthor}${isMulti ? ' et al.' : ''}, ${citation.year}`

  if (!revealed) {
    return (
      <span className="inline-flex items-center gap-1 mx-0.5 align-baseline whitespace-nowrap">
        <span className="inline-flex items-center px-2 py-0.5 rounded-md border bg-white text-xs font-medium text-gray-500"
              style={{ borderColor: '#E5E7EB' }}>
          {label}
        </span>
        <span className="inline-flex items-center px-2 py-0.5 rounded-md border bg-white text-xs font-semibold"
              style={{ borderColor: '#FCA5A5', color: '#C8102E' }}>
          {citation.status === 'verified' ? '↗ Full Text' : '↗ View Page'}
        </span>
      </span>
    )
  }

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
        <span className="text-[11px] leading-none">{status.icon}</span>
      </button>
      <button
        onPointerDown={onClick}
        className="inline-flex items-center px-2 py-0.5 rounded-md border text-xs font-semibold hover:bg-red-50 transition-all"
        style={{ borderColor: '#FCA5A5', color: '#C8102E', background: 'white' }}
      >
        {citation.status === 'verified' ? '↗ Full Text' : '↗ View Page'}
      </button>
    </span>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Citation popup — verified vs unverified
// ───────────────────────────────────────────────────────────────────────────
function CitationPopup({ citation, libName, onClose, onSeeAlternatives }) {
  const isVerified = citation.status === 'verified'
  const cited = isVerified ? Math.floor(50 + (citation.id * 47) % 200) : null

  // Auto-close unverified popup after 2s and hand off to alternatives panel
  useEffect(() => {
    if (isVerified) return
    const id = setTimeout(() => onSeeAlternatives?.(citation), 2200)
    return () => clearTimeout(id)
  }, [citation, isVerified, onSeeAlternatives])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6 animate-fade-in"
      onPointerDown={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full overflow-hidden animate-slide-up"
        onPointerDown={e => e.stopPropagation()}
      >

        {/* Header — icon + title + close */}
        <div className="px-5 pt-5 pb-3 flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 text-xl"
            style={{ background: '#F3F4F6', color: '#374151' }}
          >
            {isVerified ? '📄' : '📖'}
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
            <div className="px-5 pb-3 flex items-center gap-2 text-xs text-gray-500 border-b border-gray-100">
              <span>📄 <strong className="text-gray-700">{cited}</strong> Web of Science citations</span>
            </div>

            <div className="px-5 py-4">
              <div className="bg-[#DCFCE7] border border-[#86EFAC] rounded-lg px-3 py-2 mb-3 flex items-center gap-2 text-xs font-semibold text-[#1A7F37]">
                <span>✅</span>
                Available through {libName}
              </div>

              <button
                className="w-full bg-nexus-red hover:bg-nexus-red-dark active:scale-[0.99] text-white font-bold py-3 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
              >
                <span>↗</span> View Full Article
              </button>

              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <button className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-xs transition-colors">
                  💬 Cite <span className="text-gray-400">▾</span>
                </button>
                <button className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-xs transition-colors">
                  📤 Export to <span className="text-gray-400">▾</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Unverified popup body — copy varies by status */}
        {!isVerified && (() => {
          const status = STATUS[citation.status]
          const headline = POPUP_HEADLINES[citation.status] ?? 'Source not verified.'
          const body     = POPUP_BODIES[citation.status]     ?? 'This source could not be verified in academic databases. Always verify sources before citing them.'
          return (
          <>
            <div className="px-5 pb-4">
              <div
                className="rounded-lg border px-3.5 py-3"
                style={{ background: status.bg, borderColor: status.border }}
              >
                <p className="text-sm font-bold mb-1.5" style={{ color: status.color }}>{headline}</p>
                <p className="text-xs leading-relaxed text-gray-700">{body}</p>
                <button
                  onPointerDown={() => onSeeAlternatives?.(citation)}
                  className="mt-2.5 text-xs font-semibold hover:underline"
                  style={{ color: status.color }}
                >
                  See verified alternatives →
                </button>
              </div>
            </div>

            <div className="px-5 pb-5">
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-xs transition-colors">
                  💬 Cite <span className="text-gray-400">▾</span>
                </button>
                <button className="flex items-center justify-center gap-1.5 border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-2.5 rounded-lg text-xs transition-colors">
                  📤 Export to <span className="text-gray-400">▾</span>
                </button>
              </div>
            </div>
          </>
          )
        })()}
      </div>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Sidebar header — WHITE style (red logo, dark text)
// ───────────────────────────────────────────────────────────────────────────
function SidebarHeader({ libName }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
      <NexusLogo size={40} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold leading-tight text-gray-900 truncate">{libName}</p>
        <p className="text-[11px] text-gray-500 leading-tight truncate">Nexus Academic Assistant from Clarivate</p>
      </div>
      <button className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 flex-shrink-0" aria-label="Expand">
        ↗
      </button>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Tabs row inside the sidebar
// ───────────────────────────────────────────────────────────────────────────
function SidebarTabs({ activeTab, setActiveTab }) {
  return (
    <div className="grid grid-cols-2 gap-2 px-3 pt-3 pb-2 bg-white border-b border-gray-100">
      <button
        onPointerDown={() => setActiveTab('cited')}
        className={`px-3 py-2 rounded-md text-xs font-bold transition-colors ${
          activeTab === 'cited' ? 'bg-white text-gray-900 border border-gray-300 shadow-sm' : 'bg-gray-100 text-gray-500'
        }`}
      >
        Sources Cited on Page
      </button>
      <button
        onPointerDown={() => setActiveTab('related')}
        className={`px-3 py-2 rounded-md text-xs font-bold transition-colors ${
          activeTab === 'related' ? 'bg-white text-gray-900 border border-gray-300 shadow-sm' : 'bg-gray-100 text-gray-500'
        }`}
      >
        Related Scholarly Sources
      </button>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Citation card — full-width entry in either tab
// ───────────────────────────────────────────────────────────────────────────
function CitationCard({ citation, libName, onClick, number }) {
  const status = STATUS[citation.status]
  const cited = Math.floor(50 + (citation.id * 47) % 200)
  const authorsShort = citation.authors.split(',').slice(0, 3).join(',') + (citation.authors.split(',').length > 3 ? ', et al.' : '')

  return (
    <button
      onPointerDown={onClick}
      className="w-full text-left bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-400 hover:bg-gray-50 active:scale-[0.99] transition-all"
    >
      <div className="flex items-start gap-2">
        {number != null && (
          <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
            {number}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-gray-900 leading-snug mb-1 line-clamp-2">
            {citation.title}
          </p>
          <p className="text-[10px] text-gray-500 leading-snug truncate">
            {authorsShort}
          </p>
          <p className="text-[10px] text-gray-400 leading-snug truncate">
            • {citation.journal} ({citation.year})
          </p>

          <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-500">
            <span>📄 {cited} WoS citations ↗</span>
          </div>

          <div className="flex items-center gap-1 mt-1.5">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
              Article
            </span>
            {citation.status === 'verified' && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                Peer-reviewed
              </span>
            )}
          </div>

          {/* Library availability footer */}
          <div className="mt-2 -mx-1 px-2 py-1.5 bg-gray-50 rounded">
            <p className="text-[10px] text-gray-500 leading-snug">
              {citation.status === 'verified'
                ? <>In <strong className="text-gray-700">{libName}</strong> collection · View source details ↗</>
                : <>Source not in <strong className="text-gray-700">{libName}</strong> collection ↗</>
              }
            </p>
            <div className="flex items-center gap-2 mt-1 text-[10px] font-semibold" style={{ color: '#C8102E' }}>
              <span>↗ View Full Text</span>
              <span className="text-gray-300">·</span>
              <span>💬 Cite ▾</span>
              <span className="text-gray-300">·</span>
              <span>📤 Export to ▾</span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <span
          className="text-base flex-shrink-0 leading-none mt-0.5"
          title={status.label}
        >
          {status.icon}
        </span>
      </div>
    </button>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Library Services panel — bottom of sidebar (SPEC §7.7a)
// ───────────────────────────────────────────────────────────────────────────
function LibraryServicesPanel({ libName }) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 py-4 flex flex-col gap-4">
      {/* Library Hours */}
      <section>
        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          🕐 Library Hours
        </p>
        <div className="flex flex-col text-[11px] text-gray-700 divide-y divide-gray-100">
          {[
            ['Monday – Thursday', '7:00 AM – 12:00 AM'],
            ['Friday',            '7:00 AM – 8:00 PM'],
            ['Saturday',          '9:00 AM – 6:00 PM'],
            ['Sunday',           '10:00 AM – 12:00 AM'],
          ].map(([day, hours]) => (
            <div key={day} className="flex items-center justify-between py-1">
              <span className="text-gray-500">{day}</span>
              <span className="font-medium text-gray-800">{hours}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section>
        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
          ✉️ Contact Information
        </p>
        <div className="flex flex-col gap-1 text-[11px]" style={{ color: '#C8102E' }}>
          <a className="flex items-center gap-1.5 hover:underline">📞 (555) 123-4567</a>
          <a className="flex items-center gap-1.5 hover:underline">✉️ library@{libName.toLowerCase().split(' ')[0].replace(/[^a-z]/g, '')}.edu</a>
        </div>
      </section>

      {/* Quick Links */}
      <section>
        <p className="text-xs font-bold text-gray-900 uppercase tracking-wide mb-2">Quick Links</p>
        <div className="flex flex-col gap-1 text-[11px] font-semibold" style={{ color: '#C8102E' }}>
          <a className="hover:underline">Research Guides ↗</a>
          <a className="hover:underline">Library Catalog ↗</a>
          <a className="hover:underline">Ask a Librarian ↗</a>
          <a className="hover:underline">Visit Us ↗</a>
        </div>
      </section>
    </div>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Sources Cited tab content
// ───────────────────────────────────────────────────────────────────────────
function CitedTab({ citations, libName, onCitationClick }) {
  const verifiedCount   = citations.filter(c => c.status === 'verified').length
  const unverifiedCount = citations.length - verifiedCount

  return (
    <>
      <div className="px-4 pt-4 pb-3 bg-white">
        <p className="text-sm font-bold text-gray-900 mb-2">Sources Cited on Page</p>
        <p className="text-[11px] text-gray-600 leading-snug bg-gray-50 border border-gray-100 rounded-md px-3 py-2">
          Checking ChatGPT sources against your library's academic databases. Always double-check ChatGPT claims for accuracy.
        </p>

        <div className="flex flex-col gap-1.5 mt-3 text-[11px]">
          <div className="flex items-baseline gap-2">
            <span className="text-base leading-none">✅</span>
            <span className="font-bold text-gray-900">{verifiedCount} Verified</span>
            <span className="text-gray-500">= Source confirmed for research</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-base leading-none">⚠️</span>
            <span className="font-bold text-gray-900">{unverifiedCount} Unverified</span>
            <span className="text-gray-500">= Partial or no academic match</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-3 flex flex-col gap-2 bg-white">
        {citations.map(c => (
          <CitationCard
            key={c.id}
            citation={c}
            libName={libName}
            onClick={() => onCitationClick(c)}
          />
        ))}
      </div>
    </>
  )
}

// ───────────────────────────────────────────────────────────────────────────
// Related Scholarly Sources tab content
// ───────────────────────────────────────────────────────────────────────────
function RelatedTab({ citations, relatedFor, libName, onCitationClick }) {
  // Determine which alternatives to show: scoped to relatedFor when present,
  // otherwise the full union across all citations with alternatives.
  let alts = []
  if (relatedFor && relatedFor.alternatives?.length) {
    alts = relatedFor.alternatives.map((a, i) => ({
      ...synthesizeAltCitation(a, relatedFor.id * 10 + i),
      source: relatedFor,
    }))
  } else {
    citations.forEach(c => {
      if (c.alternatives?.length) {
        c.alternatives.forEach((a, i) => {
          alts.push({ ...synthesizeAltCitation(a, c.id * 10 + i), source: c })
        })
      }
    })
  }

  return (
    <>
      <div className="px-4 pt-4 pb-3 bg-white">
        <p className="text-sm font-bold text-gray-900 mb-2">Related Scholarly Sources</p>
        <p className="text-[11px] text-gray-600 leading-snug bg-gray-50 border border-gray-100 rounded-md px-3 py-2">
          <strong>Why this source:</strong> Verified, peer-reviewed alternatives from your library's academic collections — relevant to the unverified citation
          {relatedFor ? <> <em className="not-italic font-semibold">"{relatedFor.title.slice(0, 40)}…"</em></> : null}.
        </p>
      </div>

      <div className="px-3 pb-3 flex flex-col gap-2 bg-white">
        {alts.length === 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-md px-3 py-4 text-center text-xs text-gray-400">
            No alternatives surfaced for this scenario.
          </div>
        )}
        {alts.map((c, i) => (
          <CitationCard
            key={c.id}
            citation={c}
            libName={libName}
            number={i + 1}
            onClick={() => onCitationClick(c)}
          />
        ))}
      </div>
    </>
  )
}

// Build a citation-shaped object out of a `display` string from alternatives[]
function synthesizeAltCitation(alt, id) {
  // alt.display looks like: "Last, F. M. (YYYY). Title. Journal."
  const yearMatch = alt.display.match(/\((\d{4})\)/)
  const year = yearMatch ? parseInt(yearMatch[1]) : ''
  // Authors = before "(YYYY)"
  const authors = (alt.display.split('(')[0] || '').trim().replace(/\.$/, '')
  // After "(YYYY).", rest is "Title. Journal."
  const rest = alt.display.replace(/^.*?\)\.\s*/, '')
  const [titleRaw, journalRaw = ''] = rest.split(/\.\s+(?=[A-Z])/)
  return {
    id: `alt-${id}`,
    status: 'verified',
    authors,
    year,
    title: (titleRaw || alt.display).replace(/\.$/, ''),
    journal: (journalRaw || '').replace(/\.$/, '') || 'Library-licensed source',
    alternatives: [],
  }
}

// ───────────────────────────────────────────────────────────────────────────
// Sidebar — composes header, tabs, the active tab, and library services
// ───────────────────────────────────────────────────────────────────────────
function NexusSidebar({
  citations, scanning, libName,
  activeTab, setActiveTab,
  relatedFor,
  onCitationClick,
}) {
  if (scanning) {
    return (
      <aside className="w-[400px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col">
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
            Checking against the Central Discovery Index and Web of Science…
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="w-[400px] flex-shrink-0 bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
      <SidebarHeader libName={libName} />
      <SidebarTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 min-h-0 overflow-y-auto bg-white">
        {activeTab === 'cited' && (
          <CitedTab
            citations={citations}
            libName={libName}
            onCitationClick={onCitationClick}
          />
        )}
        {activeTab === 'related' && (
          <RelatedTab
            citations={citations}
            relatedFor={relatedFor}
            libName={libName}
            onCitationClick={onCitationClick}
          />
        )}
        <LibraryServicesPanel libName={libName} />
      </div>
    </aside>
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
  const [activeTab, setActiveTab] = useState('cited')
  const [active, setActive] = useState(null)        // popup citation
  const [relatedFor, setRelatedFor] = useState(null) // alternatives target

  const libName = institution
    ? institution.split(',')[0].replace(/\s+(Libraries?|Library System?|Librar\w*)$/i, '') + ' Library'
    : 'Your Library'

  const citationsById = scenario.citations.reduce((acc, c) => { acc[c.id] = c; return acc }, {})

  useEffect(() => {
    const id = setTimeout(() => setScanning(false), 1800)
    return () => clearTimeout(id)
  }, [])

  function handlePillOrCardClick(c) {
    setActive(c)
  }

  // Hand-off from unverified popup → close, switch sidebar tab to Related,
  // scope the alternatives panel to this citation.
  function handleSeeAlternatives(c) {
    setActive(null)
    setRelatedFor(c)
    setActiveTab('related')
  }

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Booth top bar */}
      <div className="flex-shrink-0 flex items-center justify-between px-8 py-4 bg-white border-b border-gray-100">
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
        className="flex-shrink-0 px-8 py-3 text-center text-sm font-medium transition-all"
        style={{
          background: scanning ? '#FEE2E2' : '#DCFCE7',
          color:      scanning ? '#C8102E' : '#1A7F37',
        }}
      >
        {scanning
          ? '● Nexus is scanning citations against the Central Discovery Index and Web of Science…'
          : `✓ Scan complete — ${scenario.citations.filter(c => c.status !== 'verified').length} unverified across ${scenario.citations.length} citations, in under 2 seconds`
        }
      </div>

      {/* Live Nexus mockup */}
      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-6">
        <div className="max-w-[1280px] mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">

          <ChatTabs />

          <div className="flex" style={{ minHeight: 540 }}>

            {/* Chat panel */}
            <div className="flex-1 px-8 py-6 overflow-hidden">

              {/* User message */}
              <div className="flex items-start gap-3 mb-6">
                <UserAvatar />
                <p className="text-gray-800 text-base leading-relaxed font-medium pt-2">
                  {scenario.question}
                </p>
              </div>

              {/* AI message */}
              <div className="flex items-start gap-3">
                <AIAvatar />
                <div className="flex-1 text-gray-800 text-[15px] leading-[1.85] whitespace-pre-line pt-1">
                  {renderResponse(scenario.ai_response, citationsById, !scanning, handlePillOrCardClick)}
                </div>
              </div>

              {/* Composer (decorative) */}
              <div className="mt-8 bg-gray-100 rounded-xl px-4 py-3 flex items-center gap-3 text-gray-400 text-sm">
                <span className="flex-1">Message ChatGPT…</span>
                <button className="w-8 h-8 rounded-md bg-[#5E33BF] flex items-center justify-center text-white text-sm" aria-label="Send">
                  ➤
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <NexusSidebar
              citations={scenario.citations}
              scanning={scanning}
              libName={libName}
              activeTab={activeTab}
              setActiveTab={(t) => { setActiveTab(t); if (t === 'cited') setRelatedFor(null) }}
              relatedFor={relatedFor}
              onCitationClick={handlePillOrCardClick}
            />
          </div>
        </div>

        {/* Helper hint */}
        {!scanning && !active && (
          <p className="text-center text-gray-500 text-sm mt-5 animate-fade-in">
            💡 Tap any citation pill to see how Nexus verified it.
          </p>
        )}
      </div>

      {/* Citation popup */}
      {active && (
        <CitationPopup
          citation={active}
          libName={libName}
          onClose={() => setActive(null)}
          onSeeAlternatives={handleSeeAlternatives}
        />
      )}
    </div>
  )
}
