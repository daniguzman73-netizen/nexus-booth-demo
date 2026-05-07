import { useState } from 'react'
import NexusLogo from './shared/NexusLogo'
import { addEntry, getRank } from '../lib/leaderboard'

export default function LeaderboardEntry({ session, onSubmit, onSkip }) {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [optIn, setOptIn]       = useState(false)
  const [nameError, setNameError] = useState(false)

  const instName = session.institution
    ? session.institution.split(',')[0].replace(/\s+(Libraries?|Library System?|Librar\w*)$/i, '')
    : ''

  function handleSubmit() {
    if (!name.trim()) { setNameError(true); return }
    setNameError(false)
    const entry = addEntry({
      name,
      institution: session.institution || '',
      email,
      optIn,
      score: session.score,
      discipline: session.discipline?.name || '',
    })
    const rank = getRank(session.score)
    onSubmit({ entry, rank })
  }

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3">
          <NexusLogo size={30} />
          <span className="text-gray-700 font-semibold">Nexus Extend</span>
        </div>
        <h2 className="text-xl font-black text-gray-900">Add to Leaderboard</h2>
        <div className="min-w-[100px]" />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-8 py-8">
        <div className="max-w-xl mx-auto flex flex-col gap-6">

          {/* Score summary */}
          <div className="bg-[#5E33BF] rounded-3xl p-6 text-white flex items-center gap-6">
            <div>
              <p className="text-[#C4B5F8] text-sm font-semibold">Your score</p>
              <p className="text-5xl font-black">{session.score}</p>
              <p className="text-[#C4B5F8] text-sm">points</p>
            </div>
            <div className="flex-1 border-l border-white/20 pl-6">
              <p className="text-white/80 text-sm">Discipline</p>
              <p className="text-white font-semibold text-base">{session.discipline?.icon} {session.discipline?.name}</p>
              {instName && (
                <>
                  <p className="text-white/80 text-sm mt-2">Library</p>
                  <p className="text-white font-semibold text-base">{instName}</p>
                </>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 flex flex-col gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setNameError(false) }}
                placeholder="First name or display name"
                className="w-full px-5 py-4 rounded-xl border-2 text-gray-900 text-lg placeholder-gray-400 outline-none transition-all"
                style={{
                  borderColor: nameError ? '#C8102E' : name ? '#5E33BF' : '#E5E7EB',
                  boxShadow: name && !nameError ? '0 0 0 3px rgba(94,51,191,0.1)' : 'none',
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={60}
              />
              {nameError && <p className="text-red-500 text-xs mt-1">Please enter a name</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@library.edu"
                className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 text-gray-900 text-lg placeholder-gray-400 outline-none transition-all focus:border-[#5E33BF] focus:shadow-[0_0_0_3px_rgba(94,51,191,0.1)]"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={100}
              />
            </div>

            {/* Opt-in */}
            <button
              onPointerDown={() => setOptIn(v => !v)}
              className="flex items-start gap-4 text-left group touch-target"
            >
              <div
                className="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={{
                  background: optIn ? '#5E33BF' : 'white',
                  borderColor: optIn ? '#5E33BF' : '#D1D5DB',
                }}
              >
                {optIn && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-gray-600 text-sm leading-relaxed group-active:text-gray-900">
                I'd like to learn more about Nexus Extend for my library. Clarivate may contact me.
              </span>
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onPointerDown={handleSubmit}
              className="w-full bg-[#5E33BF] hover:bg-[#4A25A0] active:scale-[0.99] text-white font-black text-xl py-6 rounded-2xl transition-all shadow-lg touch-target"
              style={{ boxShadow: '0 12px 40px rgba(94,51,191,0.35)' }}
            >
              Submit to leaderboard →
            </button>
            <button
              onPointerDown={onSkip}
              className="w-full py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-700 font-medium text-base transition-colors touch-target"
            >
              Skip — just see the results
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
