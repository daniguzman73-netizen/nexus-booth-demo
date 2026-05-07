import { useState, useEffect } from 'react'
import NexusLogo from './shared/NexusLogo'

const STATUS_CONFIG = {
  verified:     { label: 'Verified',              color: '#1A7F37', bg: '#DCFCE7', icon: '✓' },
  predatory:    { label: 'Predatory journal',      color: '#C8102E', bg: '#FEE2E2', icon: '⚠' },
  preprint:     { label: 'Unreviewed preprint',    color: '#D97706', bg: '#FEF3C7', icon: '⚠' },
  inaccessible: { label: 'Not accessible',         color: '#7C3AED', bg: '#EDE9FE', icon: '🔒' },
  unverified:   { label: 'Possible hallucination', color: '#C8102E', bg: '#FEE2E2', icon: '✗' },
}

function ScanBadge({ status, visible }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-500"
      style={{
        background: visible ? cfg.bg : '#F3F4F6',
        color: visible ? cfg.color : '#D1D5DB',
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        opacity: visible ? 1 : 0,
      }}
    >
      {visible ? cfg.icon : '…'} {visible ? cfg.label : 'Checking…'}
    </span>
  )
}

export default function NexusRevealScreen({ session, onNext }) {
  const { scenario } = session
  const [revealed, setRevealed] = useState(0) // how many citations have been "scanned"
  const [scanning, setScanning] = useState(true)

  useEffect(() => {
    if (revealed >= scenario.citations.length) {
      setScanning(false)
      return
    }
    const delay = revealed === 0 ? 600 : 700
    const id = setTimeout(() => setRevealed(r => r + 1), delay)
    return () => clearTimeout(id)
  }, [revealed, scenario.citations.length])

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <NexusLogo size={30} />
          <span className="text-gray-700 font-semibold">Nexus Extend</span>
        </div>
        <h2 className="text-xl font-black text-gray-900">Nexus Verification</h2>
        <div className="min-w-[100px]" />
      </div>

      <div className="px-8 py-8">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

          {/* Hero banner */}
          <div className="bg-[#5E33BF] rounded-3xl p-8 text-white flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              {scanning
                ? <ScanningSpinner />
                : <span className="text-3xl">✓</span>
              }
            </div>
            <div>
              <p className="text-2xl font-black mb-1">
                {scanning ? 'Nexus is scanning citations…' : 'Scan complete!'}
              </p>
              <p className="text-[#C4B5F8] text-base">
                {scanning
                  ? 'Checking against Web of Science, CDI, and predatory journal lists'
                  : 'Nexus found the same issues you spotted — in under 3 seconds'
                }
              </p>
            </div>
          </div>

          {/* Citations with reveal animation */}
          <div className="flex flex-col gap-3">
            {scenario.citations.map((c, i) => {
              const cfg = STATUS_CONFIG[c.status]
              const isRevealed = i < revealed
              const isActive = i === revealed

              return (
                <div
                  key={c.id}
                  className="bg-white rounded-2xl p-5 border-2 transition-all duration-500"
                  style={{
                    borderColor: isRevealed ? cfg.color + '40' : '#E5E7EB',
                    opacity: isActive ? 0.7 : 1,
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 transition-all duration-500"
                      style={{
                        background: isRevealed ? cfg.bg : '#F3F4F6',
                        color: isRevealed ? cfg.color : '#9CA3AF',
                      }}
                    >
                      {c.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <ScanBadge status={c.status} visible={isRevealed} />
                        {isActive && (
                          <span className="text-xs text-gray-400 animate-pulse">scanning…</span>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm font-medium leading-snug mb-0.5">{c.title}</p>
                      <p className="text-gray-400 text-xs truncate">{c.authors} · {c.journal} · {c.year}</p>
                      {isRevealed && (
                        <p
                          className="text-xs mt-2 font-medium transition-all duration-300"
                          style={{ color: cfg.color }}
                        >
                          {c.nexus_message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* CTA — shown after all revealed */}
          {!scanning && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center animate-slide-up">
              <p className="text-2xl font-black text-gray-900 mb-2">Want to see what to do next?</p>
              <p className="text-gray-500 text-base mb-6">
                See the verified alternatives and how your library can help.
              </p>
              <button
                onPointerDown={onNext}
                className="bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-black text-xl px-12 py-5 rounded-2xl transition-all shadow-lg"
                style={{ boxShadow: '0 12px 40px rgba(94,51,191,0.35)' }}
              >
                See Nexus Guidance →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ScanningSpinner() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="animate-spin">
      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M 18 4 A 14 14 0 0 1 32 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
