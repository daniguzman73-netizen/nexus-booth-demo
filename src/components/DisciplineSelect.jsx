import { useState } from 'react'
import { DISCIPLINES } from '../data/disciplines'

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <line x1="5" y1="12" x2="19" y2="12" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="12 5 19 12 12 19" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DisciplineSelect({ onSelect }) {
  const [hovered, setHovered] = useState(null)
  const [pressed, setPressed]  = useState(null)

  return (
    <div className="kiosk-full bg-[#F3F4F6] flex flex-col">

      {/* ── Main content (no top chrome) ────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-14 py-10">
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
                  className="group relative bg-white rounded-3xl px-6 py-7 transition-all duration-150 select-none flex flex-col items-center text-center gap-4"
                  style={{
                    border: `2px solid ${isHovered ? '#C8102E' : 'transparent'}`,
                    boxShadow: isHovered
                      ? '0 12px 32px rgba(200,16,46,0.14), 0 2px 8px rgba(0,0,0,0.05)'
                      : '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
                    transform: isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.02)' : 'scale(1)',
                  }}
                >
                  {/* Emoji bubble — slightly larger now that there's less text */}
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-[2.75rem] transition-transform duration-150"
                    style={{
                      background: disc.bgColor,
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                    }}
                  >
                    {disc.icon}
                  </div>

                  {/* Discipline name */}
                  <h3 className="text-[1.45rem] font-black text-gray-900 tracking-tight leading-tight">
                    {disc.name}
                  </h3>

                  {/* Arrow badge — visible on hover */}
                  <div
                    className="absolute top-5 right-5 transition-all duration-150"
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
