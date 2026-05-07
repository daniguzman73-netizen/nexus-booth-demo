import { useState, useEffect } from 'react'
import NexusLogo from './shared/NexusLogo'

// Animation phases:
//   0 → "scanning" (image 02 — red "X sources found · Click to verify")
//   1 → "results"  (image 03 — expanded sidebar with status icons)
const PHASE_DURATION = 2200 // ms

function ScanningSpinner() {
  return (
    <svg width="28" height="28" viewBox="0 0 36 36" className="animate-spin">
      <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M 18 4 A 14 14 0 0 1 32 18" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

export default function NexusRevealScreen({ session, onNext }) {
  const { scenario } = session
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (phase >= 1) return
    const id = setTimeout(() => setPhase(p => p + 1), PHASE_DURATION)
    return () => clearTimeout(id)
  }, [phase])

  const issueCount = scenario.citations.filter(c => c.status !== 'verified').length

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <NexusLogo size={30} />
          <span className="text-gray-700 font-semibold">Nexus Extend</span>
        </div>
        <h2 className="text-xl font-black text-gray-900">Now, watch Nexus do it</h2>
        <div className="min-w-[100px]" />
      </div>

      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">

          {/* Hero banner */}
          <div className="bg-[#5E33BF] rounded-3xl p-7 text-white flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0">
              {phase === 0 ? <ScanningSpinner /> : <span className="text-3xl">✓</span>}
            </div>
            <div className="flex-1">
              <p className="text-2xl font-black mb-1">
                {phase === 0
                  ? 'Nexus is scanning citations…'
                  : `Nexus found ${issueCount} issues — in 2 seconds`}
              </p>
              <p className="text-[#C4B5F8] text-base">
                {phase === 0
                  ? 'Checking against Web of Science and the Central Discovery Index'
                  : 'Same answer, same citations — verified automatically against trusted scholarly databases'}
              </p>
            </div>
          </div>

          {/* Nexus product screenshot */}
          <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

            {/* Phase label overlay */}
            <div
              className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md"
              style={{
                background: phase === 0 ? 'rgba(200,16,46,0.92)' : 'rgba(26,127,55,0.92)',
                color: 'white',
              }}
            >
              {phase === 0 ? '● Scanning…' : '✓ Scan complete'}
            </div>

            {/* Image — cross-fade */}
            <div className="relative">
              <img
                src="/nexus/02_Nexus-Citations-Found.png"
                alt="Nexus scanning — sources found"
                className="w-full h-auto block transition-opacity duration-700"
                style={{ opacity: phase === 0 ? 1 : 0, position: phase === 0 ? 'relative' : 'absolute', inset: 0 }}
              />
              <img
                src="/nexus/03_Nexus-Citations-Panel.png"
                alt="Nexus expanded sidebar — citations cited on page"
                className="w-full h-auto block transition-opacity duration-700"
                style={{ opacity: phase >= 1 ? 1 : 0, position: phase >= 1 ? 'relative' : 'absolute', inset: 0 }}
              />
            </div>
          </div>

          {/* Caption */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-gray-800 text-lg leading-relaxed">
              <span className="font-bold">Nexus scanned all 5 citations in under 2 seconds</span>
              {' '}— against Web of Science and the Central Discovery Index. Each source now shows a clear status icon: verified, not peer-reviewed, or could not be verified.
            </p>
          </div>

          {/* CTA — shown after phase 1 */}
          {phase >= 1 && (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center animate-slide-up">
              <p className="text-2xl font-black text-gray-900 mb-2">See what else it does</p>
              <p className="text-gray-500 text-base mb-6">
                Verified alternatives and direct routes to your library's resources.
              </p>
              <button
                onPointerDown={onNext}
                className="bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-black text-xl px-12 py-5 rounded-2xl transition-all shadow-lg"
                style={{ boxShadow: '0 12px 40px rgba(94,51,191,0.35)' }}
              >
                See what else it does →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
