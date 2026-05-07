import { useState } from 'react'
import NexusLogo from './shared/NexusLogo'

const STEPS = [
  { id: 'verify',       title: 'Step 1 of 3 — Verified sources',     icon: '🔍' },
  { id: 'alternatives', title: 'Step 2 of 3 — Better alternatives',  icon: '📚' },
  { id: 'library',      title: 'Step 3 of 3 — Your library can help', icon: '🏛️' },
]

function VerifyStep({ scenario }) {
  const verified = scenario.citations.find(c => c.status === 'verified')
  const problematic = scenario.citations.filter(c => c.status !== 'verified')

  return (
    <div className="flex flex-col gap-5">
      <p className="text-gray-600 text-base leading-relaxed">
        Nexus checks every citation against <strong>Web of Science</strong> and the <strong>Central Discovery Index</strong>
        — the world's most trusted scholarly record.
      </p>

      <div className="bg-[#DCFCE7] rounded-2xl p-5 border border-green-200">
        <p className="text-green-800 text-xs font-bold uppercase tracking-widest mb-3">✓ Verified citation</p>
        <p className="text-gray-800 font-medium text-sm leading-relaxed">{verified?.display}</p>
        <p className="text-green-700 text-xs mt-2 font-medium">{verified?.nexus_message}</p>
      </div>

      <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
        <p className="text-red-700 text-xs font-bold uppercase tracking-widest mb-3">⚠ Citations with issues</p>
        <div className="flex flex-col gap-2">
          {problematic.map(c => (
            <div key={c.id} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {c.id}
              </span>
              <p className="text-gray-700 text-sm leading-snug">{c.title} <span className="text-red-600 text-xs font-medium">— {c.nexus_message}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AlternativesStep({ scenario }) {
  const withAlts = scenario.citations.filter(c => c.alternatives?.length > 0)

  return (
    <div className="flex flex-col gap-5">
      <p className="text-gray-600 text-base leading-relaxed">
        For every problematic citation, Nexus surfaces <strong>peer-reviewed alternatives</strong> from your library's licensed collections.
      </p>

      {withAlts.length === 0 && (
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 text-gray-500 text-sm text-center">
          No alternatives available for this scenario's citations.
        </div>
      )}

      {withAlts.map(c => (
        <div key={c.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <p className="text-red-600 text-xs font-bold uppercase tracking-widest mb-1">Replacing citation {c.id}</p>
          <p className="text-gray-600 text-xs mb-4 italic leading-snug">"{c.title}" ({c.journal})</p>
          <p className="text-green-700 text-xs font-bold uppercase tracking-widest mb-3">✓ Recommended alternatives</p>
          <div className="flex flex-col gap-2">
            {c.alternatives.map((alt, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-[#DCFCE7]/60 rounded-xl p-3"
              >
                <div className="w-6 h-6 rounded-full bg-[#1A7F37]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[#1A7F37] text-xs font-bold">✓</span>
                </div>
                <p className="text-gray-700 text-sm leading-snug">{alt.display}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function LibraryStep({ scenario, institution }) {
  const libName = institution
    ? institution.split(',')[0].replace(/\s+(Libraries?|Library System?|Librar\w*)$/i, '')
    : 'Your library'

  return (
    <div className="flex flex-col gap-5">
      <p className="text-gray-600 text-base leading-relaxed">
        Nexus Extend connects researchers directly with <strong>{libName}</strong>'s specialist services.
      </p>

      <div className="bg-[#5E33BF]/8 rounded-2xl p-6 border border-[#5E33BF]/20">
        <p className="text-[#5E33BF] text-xs font-bold uppercase tracking-widest mb-5">Available right now</p>
        <div className="flex flex-col gap-4">
          {scenario.library_services?.subject_specialist && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5E33BF]/15 flex items-center justify-center text-2xl flex-shrink-0">
                👩‍🏫
              </div>
              <div>
                <p className="text-gray-800 font-semibold text-base">Subject Specialist</p>
                <p className="text-[#5E33BF] text-sm font-medium">{scenario.library_services.subject_specialist}</p>
                <p className="text-gray-400 text-xs">Available for consultations</p>
              </div>
            </div>
          )}
          <div className="h-px bg-[#5E33BF]/10" />
          {scenario.library_services?.research_guide && (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#5E33BF]/15 flex items-center justify-center text-2xl flex-shrink-0">
                📖
              </div>
              <div>
                <p className="text-gray-800 font-semibold text-base">Research Guide</p>
                <p className="text-[#5E33BF] text-sm font-medium">{scenario.library_services.research_guide}</p>
                <p className="text-gray-400 text-xs">Curated resources for this topic</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p className="text-gray-800 font-semibold mb-2">Nexus Extend integrates with your library system to:</p>
        <ul className="flex flex-col gap-1.5">
          {[
            'Show real-time access status for every citation',
            'Surface library-licensed alternatives automatically',
            'Route researchers to the right specialist',
            'Track citation quality across your institution',
          ].map(item => (
            <li key={item} className="flex items-start gap-2 text-gray-600 text-sm">
              <span className="text-[#16AB03] font-bold mt-0.5">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default function GuidedTour({ session, onNext }) {
  const [step, setStep] = useState(0)

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

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-2xl mx-auto flex flex-col gap-6">

          {/* Step header */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#5E33BF]/10 flex items-center justify-center text-3xl">
              {STEPS[step].icon}
            </div>
            <div>
              <p className="text-[#5E33BF] text-xs font-bold uppercase tracking-widest">{STEPS[step].title}</p>
            </div>
          </div>

          {/* Step dots */}
          <div className="flex items-center gap-3">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className="flex items-center gap-3 cursor-pointer"
                onPointerDown={() => setStep(i)}
              >
                <div
                  className="w-3 h-3 rounded-full transition-all duration-200"
                  style={{ background: i === step ? '#5E33BF' : i < step ? '#16AB03' : '#D1D5DB' }}
                />
                {i < STEPS.length - 1 && (
                  <div className="w-10 h-1 rounded-full" style={{ background: i < step ? '#16AB03' : '#E5E7EB' }} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div key={step} className="animate-slide-up">
            {step === 0 && <VerifyStep scenario={session.scenario} />}
            {step === 1 && <AlternativesStep scenario={session.scenario} />}
            {step === 2 && <LibraryStep scenario={session.scenario} institution={session.institution} />}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4 mt-2">
            <button
              onPointerDown={() => setStep(s => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-semibold text-base disabled:opacity-30 touch-target"
            >
              ← Back
            </button>

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
