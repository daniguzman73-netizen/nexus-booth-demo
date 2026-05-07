import { useState } from 'react'
import NexusLogo from './shared/NexusLogo'

// Per SPEC §7.10:
//   Step 1 — Full text       → image 05 (verified citation popup)
//   Step 2 — Alternatives    → images 06 → 04 (unverified popup → related sources)
//   Step 3 — Library services → image 07 (branded footer)
const STEPS = [
  {
    id: 'verify',
    badge: 'Step 1 of 3',
    title: 'One-click full text',
    subtitle: 'Tap any verified citation — get full details and a direct link to the article.',
    body: 'Nexus shows the full citation record, citation count, related works, and a "View Full Article" button that opens the paper through your library\'s entitlements — no login fumbling.',
    image: '/nexus/05_Nexus-Citation-Popup.png',
    alt: 'Nexus inline popup for a verified citation showing View Full Article button',
  },
  {
    id: 'alternatives',
    badge: 'Step 2 of 3',
    title: 'Trusted alternatives',
    subtitle: 'Tap an unverified citation — Nexus suggests peer-reviewed replacements.',
    body: 'For citations Nexus can\'t verify in academic databases, the "Find Verified Alternative" button surfaces 2–3 vetted alternatives from Web of Science, all available through your library.',
    images: ['/nexus/06_Nexus-Unverified-Source.png', '/nexus/04_Nexus-Related-Sources-Panel.png'],
    alt: 'Nexus unverified popup transitioning to related scholarly sources panel',
  },
  {
    id: 'library',
    badge: 'Step 3 of 3',
    title: 'Your library, right inside the chat',
    subtitle: 'Library hours, contact, chat, research guides — one click away.',
    body: 'Nexus Extend folds your library\'s services directly into the AI workflow: hours, librarian chat, subject guides, and quick links — all branded with your institution\'s identity.',
    image: '/nexus/07_Nexus-Branded-Footer.png',
    alt: 'Nexus branded footer panel showing library hours, contact info, and quick links',
  },
]

function StepDots({ step, total, onJump }) {
  return (
    <div className="flex items-center gap-3">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 cursor-pointer" onPointerDown={() => onJump(i)}>
          <div
            className="w-3 h-3 rounded-full transition-all duration-200"
            style={{ background: i === step ? '#5E33BF' : i < step ? '#16AB03' : '#D1D5DB' }}
          />
          {i < total - 1 && (
            <div className="w-10 h-1 rounded-full" style={{ background: i < step ? '#16AB03' : '#E5E7EB' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function ImagePanel({ step }) {
  const [imgIdx, setImgIdx] = useState(0)
  const images = step.images ?? [step.image]

  return (
    <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      <div className="relative">
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={step.alt}
            className="w-full h-auto block transition-opacity duration-500"
            style={{
              opacity: imgIdx === i ? 1 : 0,
              position: imgIdx === i ? 'relative' : 'absolute',
              inset: 0,
            }}
          />
        ))}
      </div>

      {/* Image toggler — only when there are multiple images */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/70 backdrop-blur-md rounded-full px-2 py-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onPointerDown={() => setImgIdx(i)}
              className="px-3 py-1 rounded-full text-xs font-bold transition-all"
              style={{
                background: imgIdx === i ? 'white' : 'transparent',
                color: imgIdx === i ? '#5E33BF' : 'white',
              }}
            >
              {i === 0 ? '① Popup' : '② Alternatives panel'}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GuidedTour({ session, onNext }) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]

  const libName = session.institution
    ? session.institution.split(',')[0].replace(/\s+(Libraries?|Library System?|Librar\w*)$/i, '')
    : 'your library'

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <NexusLogo size={30} />
          <span className="text-gray-700 font-semibold">Nexus Extend</span>
        </div>
        <h2 className="text-xl font-black text-gray-900">How Nexus helps</h2>
        <div className="min-w-[100px]" />
      </div>

      <div className="px-8 py-8">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">

          {/* Step header */}
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div className="flex-1 min-w-[280px]">
              <p className="text-[#5E33BF] text-xs font-bold uppercase tracking-widest mb-2">{current.badge}</p>
              <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">{current.title}</h3>
              <p className="text-lg text-gray-500 leading-snug">{current.subtitle}</p>
            </div>
            <StepDots step={step} total={STEPS.length} onJump={setStep} />
          </div>

          {/* Two-column: image + caption */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

            {/* Nexus screenshot — 2 cols */}
            <div className="lg:col-span-2">
              <ImagePanel step={current} />
            </div>

            {/* Caption + library context — 1 col */}
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <p className="text-gray-700 text-base leading-relaxed">{current.body}</p>
              </div>

              {step === 2 && (
                <div className="bg-[#5E33BF]/8 border border-[#5E33BF]/20 rounded-2xl p-5">
                  <p className="text-[#5E33BF] text-xs font-bold uppercase tracking-widest mb-2">Branded for {libName}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Subject specialist on call: <strong>{session.scenario.library_services?.subject_specialist}</strong><br />
                    Research guide: <strong>{session.scenario.library_services?.research_guide}</strong>
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
                  <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-2">From your challenge</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Of the {session.scenario.citations.length} citations you reviewed,
                    {' '}<strong>{session.scenario.citations.filter(c => c.status !== 'verified').length} had issues</strong>.
                    Nexus surfaces verified alternatives for each one — automatically.
                  </p>
                </div>
              )}

              {step === 0 && (
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                  <p className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-2">Why it matters</p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Researchers waste hours hunting full text across paywalls. Nexus routes them straight through your library's entitlements — one click.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mt-2 bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-4">
            <button
              onPointerDown={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-semibold text-base disabled:opacity-30 touch-target px-3"
            >
              ← Back
            </button>

            <div className="text-gray-400 text-sm font-medium">
              {step + 1} of {STEPS.length}
            </div>

            {step < STEPS.length - 1 ? (
              <button
                onPointerDown={() => setStep(s => s + 1)}
                className="bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-95 text-white font-bold text-base px-8 py-4 rounded-xl transition-all touch-target"
              >
                Next →
              </button>
            ) : (
              <button
                onPointerDown={onNext}
                className="bg-[#16AB03] hover:bg-[#128A02] active:scale-95 text-white font-bold text-base px-8 py-4 rounded-xl transition-all touch-target"
              >
                Add your score to the leaderboard →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
