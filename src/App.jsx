import { useState, useCallback } from 'react'
import WelcomeScreen      from './components/WelcomeScreen'
import InstitutionSelect  from './components/InstitutionSelect'
import DisciplineSelect   from './components/DisciplineSelect'
import ScenarioIntro      from './components/ScenarioIntro'
import ChallengeScreen    from './components/ChallengeScreen'
import ResultsScreen      from './components/ResultsScreen'
import NexusRevealScreen  from './components/NexusRevealScreen'
import LeaderboardEntry   from './components/LeaderboardEntry'
import FinalScreen        from './components/FinalScreen'
import useIdleReset       from './lib/useIdleReset'
import { scoreBreakdown } from './lib/scoring'
import { recordSession }  from './lib/leaderboard'
import scenarios          from './data/scenarios.json'
import { DISCIPLINES }    from './data/disciplines'

const INITIAL_SESSION = {
  institution: null,
  discipline:  null,
  scenario:    null,
  flags:       [],
  timeUsed:    0,
  score:       0,
  entry:       null,
  rank:        null,
}

export default function App() {
  const [screen,  setScreen]  = useState('welcome')
  const [session, setSession] = useState(INITIAL_SESSION)

  const handleReset = useCallback(() => {
    setSession(INITIAL_SESSION)
    setScreen('welcome')
  }, [])

  // Idle reset on every screen except welcome
  useIdleReset(handleReset, 90_000, screen !== 'welcome')

  // ── Navigation handlers ────────────────────────────────────────

  function handleStart() {
    setScreen('institution')
  }

  // Skip-to-demo link on the welcome screen: jump directly to the live
  // Nexus reveal with a sensible default scenario.
  function handleShowNexusDemo() {
    const discipline = DISCIPLINES.find(d => d.id === 'psychology') ?? DISCIPLINES[0]
    const scenario   = scenarios.find(s => s.disciplineId === discipline.id) ?? scenarios[0]
    setSession({ ...INITIAL_SESSION, discipline, scenario })
    setScreen('nexus_reveal')
  }

  function handleInstitutionSelect(institution) {
    setSession(s => ({ ...s, institution }))
    setScreen('discipline')
  }

  function handleDisciplineSelect(discipline) {
    const scenario = scenarios.find(sc => sc.disciplineId === discipline.id) ?? scenarios[0]
    setSession(s => ({ ...s, discipline, scenario }))
    setScreen('scenario_intro')
  }

  function handleScenarioReady() {
    setScreen('challenge')
  }

  function handleChallengeSubmit({ flags, timeUsed }) {
    const breakdown = scoreBreakdown({ citations: session.scenario.citations, flags, timeUsed })
    recordSession({
      institution:      session.institution || '',
      discipline:       session.discipline?.name || '',
      score:            breakdown.total,
      flagsCount:       flags.length,
      correctlyFlagged: breakdown.correctlyFlagged,
      falseFlags:       breakdown.falseFlags,
      timeUsed,
    })
    setSession(s => ({ ...s, flags, timeUsed, score: breakdown.total }))
    setScreen('results')
  }

  function handleResultsNext() {
    setScreen('nexus_reveal')
  }

  function handleNexusNext() {
    setScreen('leaderboard_entry')
  }

  function handleLeaderboardSubmit({ entry, rank }) {
    setSession(s => ({ ...s, entry, rank }))
    setScreen('final')
  }

  function handleLeaderboardSkip() {
    setSession(s => ({ ...s, entry: null, rank: null }))
    setScreen('final')
  }

  // ── Render ─────────────────────────────────────────────────────

  return (
    <div className="kiosk-full">

      {screen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} onShowNexus={handleShowNexusDemo} />
      )}

      {screen === 'institution' && (
        <InstitutionSelect
          onSelect={handleInstitutionSelect}
        />
      )}

      {screen === 'discipline' && (
        <DisciplineSelect
          onSelect={handleDisciplineSelect}
        />
      )}

      {screen === 'scenario_intro' && (
        <ScenarioIntro
          onReady={handleScenarioReady}
        />
      )}

      {screen === 'challenge' && (
        <ChallengeScreen
          session={session}
          onSubmit={handleChallengeSubmit}
        />
      )}

      {screen === 'results' && (
        <ResultsScreen
          session={session}
          onNext={handleResultsNext}
        />
      )}

      {screen === 'nexus_reveal' && (
        <NexusRevealScreen
          session={session}
          onNext={handleNexusNext}
        />
      )}

      {screen === 'leaderboard_entry' && (
        <LeaderboardEntry
          session={session}
          onSubmit={handleLeaderboardSubmit}
          onSkip={handleLeaderboardSkip}
        />
      )}

      {screen === 'final' && (
        <FinalScreen
          session={session}
          onReset={handleReset}
        />
      )}
    </div>
  )
}
