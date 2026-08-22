'use client'

import { useEffect, useRef, useState } from 'react'

export default function TradingViewEmbed({
  src,
  config,
  height = 360,
  className = '',
}) {
  const containerRef = useRef(null)
  const [error, setError] = useState(false)
  const configKey = JSON.stringify(config)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    setError(false)
    container.innerHTML = ''

    const host = document.createElement('div')
    host.className = 'tradingview-widget-container'
    host.style.height = '100%'
    host.style.width = '100%'

    const widget = document.createElement('div')
    widget.className = 'tradingview-widget-container__widget'
    widget.style.height = '100%'
    widget.style.width = '100%'
    host.appendChild(widget)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = src.startsWith('http')
      ? src
      : `https://s3.tradingview.com/external-embedding/${src}`
    script.async = true
    script.text = JSON.stringify(config)
    host.appendChild(script)
    container.appendChild(host)

    const healthCheck = window.setTimeout(() => {
      if (!container.querySelector('iframe')) setError(true)
    }, 8000)

    return () => {
      window.clearTimeout(healthCheck)
      container.innerHTML = ''
    }
  }, [src, configKey])

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-dark-border bg-dark-card ${className}`}
      style={{ height }}
    >
      <div ref={containerRef} className="h-full w-full" />
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-slate-400 bg-dark-card">
          Live market data could not load. Refresh or disable a script blocker.
        </div>
      ) : null}
    </div>
  )
}
