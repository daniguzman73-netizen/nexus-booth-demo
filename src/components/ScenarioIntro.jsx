import { useState, useEffect } from 'react'
import NexusLogo from './shared/NexusLogo'

function BackIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <line x1="19" y1="12" x2="5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline points="12 19 5 12 12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StepDots({ step }) {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full transition-colors ${i <= step ? 'bg-nexus-red' : 'bg-gray-300'}`} />
          {i < 2 && <span className={`w-8 h-1 rounded-full transition-colors ${i < step ? 'bg-nexus-red' : 'bg-gray-200'}`} />}
        </span>
      ))}
    </div>
  )
}

export default function ScenarioIntro({ session, onReady, onBack }) {
  const [countdown, setCountdown] = useState(5)
  const { discipline, scenario } = session

  useEffect(() => {
    if (countdown <= 0) { onReady(); return }
    const id = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(id)
  }, [countdown, onReady])

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-12 py-7">
        <button
          onPointerDown={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-lg font-medium min-w-[80px] touch-target"
        >
          <BackIcon /> Back
        </button>
        <div className="flex items-center gap-3">
          <NexusLogo size={36} />
          <span className="text-gray-700 font-semibold text-lg">Nexus Extend</span>
        </div>
        <div className="min-w-[80px] flex justify-end">
          <StepDots step={2} />
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col items-center px-14 pt-4 pb-10">
        <div className="w-full max-w-3xl flex flex-col items-center text-center">

          {/* Discipline badge */}
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl mb-6"
            style={{ background: discipline.bgColor }}
          >
            {discipline.icon}
          </div>
          <div className="mb-8 px-4 py-1.5 rounded-full bg-gray-200 text-gray-600 text-sm font-semibold uppercase tracking-widest">
            {discipline.name}
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 px-12 py-10 mb-10 w-full">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-3">Research question</p>
            <p className="text-[1.6rem] font-semibold text-gray-900 leading-snug">
              "{scenario.question}"
            </p>
          </div>

          {/* Instructions */}
          <div className="flex items-start gap-5 bg-[#5E33BF]/8 border border-[#5E33BF]/20 rounded-2xl px-8 py-6 mb-10 text-left w-full">
            <span className="text-3xl mt-0.5">🎯</span>
            <div>
              <p className="text-gray-800 font-semibold text-lg mb-1">Your challenge</p>
              <p className="text-gray-600 text-base leading-relaxed">
                An AI assistant answered this question and cited 5 sources. Read the response, then flag any citations you think have problems — predatory journals, unreviewed preprints, inaccessible papers, or hallucinations.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-gray-500 text-lg mb-10">
            <span>⏱ 60 seconds</span>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span>📄 5 citations</span>
            <span className="w-1 h-1 rounded-full bg-gray-400" />
            <span>🏆 Max 400 pts</span>
          </div>

          {/* Countdown / tap-to-start */}
          <button
            onPointerDown={onReady}
            className="relative bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-black text-2xl px-16 py-6 rounded-2xl shadow-xl transition-all select-none"
            style={{ boxShadow: '0 16px 48px rgba(94,51,191,0.4)' }}
          >
            {countdown > 0 ? `Starting in ${countdown}…` : 'GO! →'}
          </button>
          <p className="mt-4 text-gray-400 text-base">or tap to start now</p>
        </div>
      </div>
    </div>
  )
}
