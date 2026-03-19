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

export default function StockTicker() {
  const containerRef = useRef(null)
  const [widgetError, setWidgetError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    setWidgetError(false)
    container.innerHTML = ''

    const widgetHost = document.createElement('div')
    widgetHost.className = 'tradingview-widget-container'
    widgetHost.style.height = '100%'
    widgetHost.style.width = '100%'

    const widgetNode = document.createElement('div')
    widgetNode.className = 'tradingview-widget-container__widget'
    widgetNode.style.height = '100%'
    widgetNode.style.width = '100%'
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
    }, 5000)

    return () => window.clearTimeout(healthCheck)
  }, [])

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-dark-border bg-dark/80 h-[56px]">
      <div ref={containerRef} className="h-full w-full" />
      {widgetError && (
        <div className="absolute inset-0 flex items-center px-4 text-xs text-slate-400">
          Live ticker blocked in this browser session. Disable strict script blockers or open in a regular browser tab.
        </div>
      )}
    </div>
  )
}
