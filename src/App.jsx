import { useState, useCallback } from 'react'
import WelcomeScreen      from './components/WelcomeScreen'
import InstitutionSelect  from './components/InstitutionSelect'
import DisciplineSelect   from './components/DisciplineSelect'
import ScenarioIntro      from './components/ScenarioIntro'
import ChallengeScreen    from './components/ChallengeScreen'
import ResultsScreen      from './components/ResultsScreen'
import NexusRevealScreen  from './components/NexusRevealScreen'
import GuidedTour         from './components/GuidedTour'
import LeaderboardEntry   from './components/LeaderboardEntry'
import FinalScreen        from './components/FinalScreen'
import useIdleReset       from './lib/useIdleReset'
import { computeScore }   from './lib/scoring'
import scenarios          from './data/scenarios.json'

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
    const score = computeScore({ citations: session.scenario.citations, flags, timeUsed })
    setSession(s => ({ ...s, flags, timeUsed, score }))
    setScreen('results')
  }

  function handleResultsNext() {
    setScreen('nexus_reveal')
  }

  function handleNexusNext() {
    setScreen('guided_tour')
  }

  function handleTourNext() {
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

      {screen === 'scenario_intro' && (
        <ScenarioIntro
          session={session}
          onReady={handleScenarioReady}
          onBack={() => setScreen('discipline')}
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

      {screen === 'guided_tour' && (
        <GuidedTour
          session={session}
          onNext={handleTourNext}
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
