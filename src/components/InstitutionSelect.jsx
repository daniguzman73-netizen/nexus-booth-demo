import { useState, useMemo, useRef } from 'react'
import NexusLogo from './shared/NexusLogo'
import institutions from '../data/institutions.json'

function SearchIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-gray-400 flex-shrink-0">
      <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function BookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

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
          <span
            className={`w-3 h-3 rounded-full transition-colors ${i <= step ? 'bg-nexus-red' : 'bg-gray-300'}`}
          />
          {i < 2 && (
            <span className={`w-8 h-1 rounded-full transition-colors ${i < step ? 'bg-nexus-red' : 'bg-gray-200'}`} />
          )}
        </span>
      ))}
    </div>
  )
}

export default function InstitutionSelect({ onSelect, onBack }) {
  const [query, setQuery]       = useState('')
  const [selected, setSelected] = useState(null)
  const [open, setOpen]         = useState(false)
  const inputRef = useRef(null)

  const results = useMemo(() => {
    if (!query.trim() || selected) return []
    const q = query.toLowerCase()
    return institutions.filter(name => name.toLowerCase().includes(q)).slice(0, 8)
  }, [query, selected])

  function pick(name) {
    setSelected(name)
    setQuery(name)
    setOpen(false)
    inputRef.current?.blur()
  }

  function clear() {
    setSelected(null)
    setQuery('')
    setOpen(true)
    setTimeout(() => { inputRef.current?.focus() }, 0)
  }

  const showDropdown = open && results.length > 0

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-12 py-8">
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
          <StepDots step={0} />
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center px-16 pt-8 pb-16">
        <div className="w-full max-w-2xl">

          <h1 className="text-[3.2rem] font-black text-gray-900 mb-3 tracking-tight leading-tight">
            Which library are you from?
          </h1>
          <p className="text-xl text-gray-500 mb-10">
            We'll personalize the demo for you.
          </p>

          {/* ── Search input ───────────────────────────────────── */}
          <div className="relative">
            <div
              className={`relative flex items-center bg-white rounded-2xl border-2 transition-all duration-150 ${
                open
                  ? 'border-nexus-red shadow-[0_0_0_4px_rgba(200,16,46,0.08)]'
                  : 'border-gray-200 shadow-sm'
              }`}
            >
              <div className="pl-6 pr-3">
                <SearchIcon />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => {
                  setQuery(e.target.value)
                  setSelected(null)
                  setOpen(true)
                }}
                onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 180)}
                placeholder="Start typing your library name…"
                className="flex-1 py-6 text-xl text-gray-900 placeholder-gray-400 outline-none bg-transparent"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              {/* Clear / check indicator */}
              {query && !selected && (
                <button
                  onPointerDown={e => { e.preventDefault(); clear() }}
                  className="pr-5 pl-3 text-gray-400 hover:text-gray-600 transition-colors touch-target flex items-center"
                  aria-label="Clear"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#E5E7EB" />
                    <line x1="15" y1="9"  x2="9"  y2="15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                    <line x1="9"  y1="9"  x2="15" y2="15" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>
              )}
              {selected && (
                <div className="pr-5 pl-3 flex items-center">
                  <div className="w-7 h-7 rounded-full bg-verified-green flex items-center justify-center">
                    <CheckIcon />
                  </div>
                </div>
              )}
            </div>

            {/* ── Dropdown ─────────────────────────────────────── */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-slide-up">
                {results.map(name => (
                  <button
                    key={name}
                    onPointerDown={e => { e.preventDefault(); pick(name) }}
                    className="w-full flex items-center gap-4 px-6 py-5 hover:bg-gray-50 active:bg-gray-100 transition-colors text-left border-b border-gray-50 last:border-0 touch-target"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <BookIcon />
                    </div>
                    <span className="text-gray-800 text-lg font-medium">{name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Continue button (appears after selection) ──────── */}
          {selected && (
            <div className="mt-6 animate-slide-up">
              <button
                onPointerDown={() => onSelect(selected)}
                className="w-full bg-nexus-red hover:bg-nexus-red-dark active:scale-[0.99] text-white text-2xl font-bold py-6 rounded-2xl transition-all shadow-lg"
              >
                Continue with {selected.split(',')[0].replace(/\s+(Libraries?|Library System?|Librar\w*)$/i, '')} →
              </button>
            </div>
          )}

          {/* ── Divider ────────────────────────────────────────── */}
          <div className="mt-10 flex items-center gap-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-gray-400 text-base">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* ── Skip button ────────────────────────────────────── */}
          <button
            onPointerDown={() => onSelect(null)}
            className="mt-6 w-full py-5 rounded-2xl border-2 border-gray-200 hover:border-gray-300 active:bg-gray-100 text-gray-600 hover:text-gray-800 text-xl font-medium transition-colors bg-white touch-target"
          >
            Skip — use generic branding
          </button>

        </div>
      </div>
    </div>
  )
}
