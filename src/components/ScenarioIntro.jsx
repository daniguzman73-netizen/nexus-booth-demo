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

export default function ScenarioIntro({ onReady, onBack }) {
  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar — Nexus Extend logo + Back + step dots */}
      <div className="flex-shrink-0 flex items-center justify-between px-12 py-7">
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

      {/* Main — centered, headline allowed full width, body constrained to 600px */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-10 pb-12">
        <div className="w-full flex flex-col items-center text-center">

          {/* Headline — sized to fit on one line at 1280–1920px viewports */}
          <h1
            className="font-black text-gray-900 leading-[1.05] tracking-tight mb-8"
            style={{ fontSize: 'clamp(44px, 4.4vw, 80px)' }}
          >
            Spot the questionable citations
          </h1>

          {/* Body — two short paragraphs, constrained for natural line breaks */}
          <div className="w-full max-w-[600px] flex flex-col items-center">
            <p className="text-gray-600 text-xl leading-relaxed mb-5">
              AI cited 5 sources. Some are questionable — predatory journals, inaccessible papers, unreviewed preprints, or hallucinations.
            </p>
            <p className="text-gray-800 text-xl leading-relaxed font-medium mb-10">
              Your job: flag them before time runs out.
            </p>

            {/* Stats */}
            <div className="flex items-center gap-6 text-gray-500 text-lg mb-10">
              <span>⏱ 60 seconds</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>📄 5 citations</span>
              <span className="w-1 h-1 rounded-full bg-gray-400" />
              <span>🏆 Max 400 pts</span>
            </div>

            {/* CTA */}
            <button
              onPointerDown={onReady}
              className="bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-black tracking-wide rounded-2xl shadow-2xl transition-all duration-100 select-none"
              style={{
                fontSize: 28,
                paddingLeft: 88, paddingRight: 88,
                paddingTop: 26, paddingBottom: 26,
                boxShadow: '0 20px 60px rgba(94,51,191,0.45)',
              }}
            >
              I'M READY →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
