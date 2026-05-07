import { useEffect, useRef } from 'react'

export default function Timer({ seconds, onTick, onExpire, running = true }) {
  const ref = useRef(seconds)

  useEffect(() => {
    ref.current = seconds
  }, [seconds])

  useEffect(() => {
    if (!running) return
    const id = setInterval(() => {
      ref.current -= 1
      onTick?.(ref.current)
      if (ref.current <= 0) {
        clearInterval(id)
        onExpire?.()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [running]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
