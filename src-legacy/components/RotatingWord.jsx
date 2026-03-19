import { useState, useEffect } from 'react'

const words = ['everyone', 'experts', 'investor']

export default function RotatingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
    }, 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="relative inline-block min-w-[8ch] h-[1.2em] align-middle text-amber-400">
      {words.map((word, i) => (
        <span
          key={word}
          className="absolute left-0 top-0 transition-all duration-500 ease-in-out whitespace-nowrap text-amber-400"
          style={{
            opacity: i === index ? 1 : 0,
            transform: i === index ? 'translateY(0)' : 'translateY(-6px)',
          }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
