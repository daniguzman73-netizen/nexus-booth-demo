export default function ScenarioIntro({ onReady }) {
  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Main content (no top chrome) — centered headline + body */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-10 py-12">
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
