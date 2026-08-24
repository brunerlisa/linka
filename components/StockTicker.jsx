'use client'
import { useEffect, useRef, useState } from 'react'

const tickerSymbols = [
  { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
  { proName: 'FOREXCOM:NSXUSD', title: 'Nasdaq 100' },
  { proName: 'FX_IDC:EURUSD', title: 'EUR to USD' },
  { proName: 'NASDAQ:MSFT', title: 'Microsoft' },
  { proName: 'NASDAQ:AMZN', title: 'Amazon' },
  { proName: 'NASDAQ:META', title: 'Meta' },
  { proName: 'NASDAQ:NVDA', title: 'Nvidia' },
]

/**
 * Market ticker under the hero. Full-width on phones; pinned to the hero bottom on desktop.
 */
export default function StockTicker() {
  const containerRef = useRef(null)
  const [widgetError, setWidgetError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    setWidgetError(false)
    container.innerHTML = ''

    const widgetHost = document.createElement('div')
    widgetHost.className = 'tradingview-widget-container'
    widgetHost.style.height = '100%'
    widgetHost.style.width = '100%'
    widgetHost.style.maxWidth = '100%'
    widgetHost.style.overflow = 'hidden'
    widgetHost.style.boxSizing = 'border-box'

    const widgetNode = document.createElement('div')
    widgetNode.className = 'tradingview-widget-container__widget'
    widgetNode.style.height = '100%'
    widgetNode.style.width = '100%'
    widgetNode.style.maxWidth = '100%'
    widgetNode.style.boxSizing = 'border-box'
    widgetHost.appendChild(widgetNode)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.text = JSON.stringify({
      symbols: tickerSymbols,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'en',
    })
    widgetHost.appendChild(script)
    container.appendChild(widgetHost)

    const healthCheck = window.setTimeout(() => {
      const iframeExists = !!container.querySelector('iframe')
      if (!iframeExists) setWidgetError(true)
    }, 8000)

    return () => {
      window.clearTimeout(healthCheck)
      container.innerHTML = ''
      setWidgetError(false)
    }
  }, [])

  return (
    <div
      className="relative lg:absolute lg:bottom-0 lg:left-0 lg:right-0 z-[5] min-w-0 max-w-full
        h-12 lg:h-[56px] w-full overflow-hidden touch-pan-x overscroll-contain
        border-y lg:border-y-0 border-dark-border lg:border-t
        bg-dark/90 lg:bg-dark/80"
    >
      <div ref={containerRef} className="h-full w-full min-w-0 max-w-full overflow-hidden [&_iframe]:max-w-full" />
      {widgetError && (
        <div className="absolute inset-0 flex items-center px-2 text-[10px] sm:text-xs text-slate-400 bg-dark/95">
          Live ticker blocked or slow to load. Try a regular browser tab or disable strict blockers.
        </div>
      )}
    </div>
  )
}
