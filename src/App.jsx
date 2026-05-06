import { useState, useCallback } from 'react'
import WelcomeScreen     from './components/WelcomeScreen'
import InstitutionSelect from './components/InstitutionSelect'
import DisciplineSelect  from './components/DisciplineSelect'
import NexusLogo         from './components/shared/NexusLogo'

// Screens handled so far: welcome → institution → discipline → [phase1_done]
// Remaining screens (Phase 2+): scenario_intro, challenge, results, nexus_reveal,
//   guided_tour, leaderboard_entry, final

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [session, setSession] = useState({ institution: null, discipline: null })

  const handleStart = useCallback(() => setScreen('institution'), [])

  const handleInstitutionSelect = useCallback((institution) => {
    setSession(s => ({ ...s, institution }))
    setScreen('discipline')
  }, [])

  const handleDisciplineSelect = useCallback((discipline) => {
    setSession(s => ({ ...s, discipline }))
    setScreen('phase1_done')
  }, [])

  const handleReset = useCallback(() => {
    setSession({ institution: null, discipline: null })
    setScreen('welcome')
  }, [])

  return (
    <div className="kiosk-full">
      {screen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}

      {screen === 'institution' && (
        <InstitutionSelect
          onSelect={handleInstitutionSelect}
          onBack={() => setScreen('welcome')}
        />
      )}

      {screen === 'discipline' && (
        <DisciplineSelect
          institution={session.institution}
          onSelect={handleDisciplineSelect}
          onBack={() => setScreen('institution')}
        />
      )}

      {/* Phase 1 end-state — replaced by Scenario Intro in Phase 2 */}
      {screen === 'phase1_done' && (
        <Phase1Done session={session} onReset={handleReset} />
      )}
    </div>
  )
}

function Phase1Done({ session, onReset }) {
  const lib = session.institution
    ? session.institution.replace(/\s+(Libraries?|Library System?|Librar\w*)$/i, '').split(',')[0]
    : 'Generic branding'

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col items-center justify-center gap-8 px-12">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-14 flex flex-col items-center gap-6 max-w-2xl w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#DCFCE7] flex items-center justify-center text-4xl">
          ✅
        </div>
        <h2 className="text-4xl font-black text-gray-900 tracking-tight">Phase 1 Complete</h2>
        <p className="text-xl text-gray-500 leading-relaxed">
          The first three screens are wired up.<br />
          Challenge screen arrives in Phase 2.
        </p>

        {/* Session summary */}
        <div className="w-full bg-gray-50 rounded-2xl p-6 flex flex-col gap-3 text-left">
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider w-28 flex-shrink-0">Library</span>
            <span className="text-gray-800 font-semibold text-lg">{lib}</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider w-28 flex-shrink-0">Discipline</span>
            <span className="text-gray-800 font-semibold text-lg">
              {session.discipline?.icon} {session.discipline?.name}
            </span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider w-28 flex-shrink-0">Question</span>
            <span className="text-gray-600 text-base italic leading-snug">"{session.discipline?.question}"</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <NexusLogo size={28} />
          <span className="text-gray-500 text-base">Next: Scenario Intro → Challenge Screen</span>
        </div>

        <button
          onPointerDown={onReset}
          className="mt-2 bg-nexus-red hover:bg-nexus-red-dark active:scale-95 text-white text-xl font-bold px-14 py-5 rounded-2xl transition-all"
        >
          ← Back to Start
        </button>
      </div>
    </div>
  )
}
