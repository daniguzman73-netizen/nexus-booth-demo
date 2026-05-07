import { useState } from 'react'
import NexusLogo from './shared/NexusLogo'
import { DISCIPLINES } from '../data/disciplines'

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

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="12 5 19 12 12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DisciplineSelect({ institution, onSelect, onBack }) {
  const [hovered, setHovered] = useState(null)
  const [pressed, setPressed]  = useState(null)

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* ── Top bar ─────────────────────────────────────────────── */}
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
          <StepDots step={1} />
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center px-14 pt-4 pb-10">
        <div className="w-full max-w-[1400px]">

          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-[3.2rem] font-black text-gray-900 mb-3 tracking-tight leading-tight">
              Pick a discipline
            </h1>
            <p className="text-xl text-gray-500">
              You'll review an AI-generated response on this topic.
            </p>
          </div>

          {/* ── 6-tile grid ─────────────────────────────────────── */}
          <div className="grid grid-cols-3 gap-5">
            {DISCIPLINES.map(disc => {
              const isHovered = hovered === disc.id
              const isPressed = pressed === disc.id
              return (
                <button
                  key={disc.id}
                  onPointerDown={() => { setPressed(disc.id); onSelect(disc) }}
                  onPointerEnter={() => setHovered(disc.id)}
                  onPointerLeave={() => setHovered(null)}
                  className="group relative bg-white text-left rounded-3xl p-8 transition-all duration-150 select-none"
                  style={{
                    border: `2px solid ${isHovered ? '#C8102E' : 'transparent'}`,
                    boxShadow: isHovered
                      ? '0 12px 32px rgba(200,16,46,0.14), 0 2px 8px rgba(0,0,0,0.05)'
                      : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                    transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {/* Emoji bubble */}
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-5 transition-transform duration-150"
                    style={{
                      background: disc.bgColor,
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {disc.icon}
                  </div>

                  {/* Discipline name */}
                  <h3 className="text-[1.55rem] font-black text-gray-900 mb-3 tracking-tight leading-snug">
                    {disc.name}
                  </h3>

                  {/* Sample question */}
                  <p className="text-gray-500 text-[0.98rem] leading-relaxed line-clamp-2">
                    "{disc.question}"
                  </p>

                  {/* Arrow badge — visible on hover */}
                  <div
                    className="absolute top-7 right-7 transition-all duration-150"
                    style={{
                      opacity: isHovered ? 1 : 0,
                      transform: isHovered ? 'translate(0,0)' : 'translate(-4px, 4px)',
                    }}
                  >
                    <div className="w-9 h-9 rounded-full bg-nexus-red flex items-center justify-center shadow-md">
                      <ArrowIcon />
                    </div>
                  </div>

                  {/* Subtle accent line at bottom on hover */}
                  <div
                    className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full transition-all duration-200"
                    style={{
                      background: disc.accentColor,
                      opacity: isHovered ? 0.5 : 0,
                    }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
