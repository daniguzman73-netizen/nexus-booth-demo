import { useEffect, useRef } from 'react'

const EVENTS = ['pointerdown', 'pointermove', 'keydown', 'touchstart']

export default function useIdleReset(onReset, timeoutMs = 90_000, enabled = true) {
  const timerRef = useRef(null)

  useEffect(() => {
    if (!enabled) return

    function reset() {
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(onReset, timeoutMs)
    }

    reset()
    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }))

    return () => {
      clearTimeout(timerRef.current)
      EVENTS.forEach(e => window.removeEventListener(e, reset))
    }
  }, [onReset, timeoutMs, enabled])
}
