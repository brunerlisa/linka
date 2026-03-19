'use client'
import { useEffect, useRef, useState } from 'react'

function LiveMarketWidget() {
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
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js'
    script.async = true
    script.text = JSON.stringify({
      width: '100%',
      height: '100%',
      symbolsGroups: [
        {
          name: 'Major Assets',
          symbols: [
            { name: 'NASDAQ:NVDA', displayName: 'Nvidia' },
            { name: 'NASDAQ:MSFT', displayName: 'Microsoft' },
            { name: 'NASDAQ:AMZN', displayName: 'Amazon' },
            { name: 'FX:EURUSD', displayName: 'EUR/USD' },
          ],
        },
      ],
      showSymbolLogo: true,
      isTransparent: true,
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
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-700/40 bg-[#0a162d]">
      <div ref={containerRef} className="h-full w-full" />
      {widgetError && (
        <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-[11px] text-slate-400 bg-[#0a162d]">
          Live quote widget blocked in this browser session. Open in a normal browser tab or disable strict blockers.
        </div>
      )}
    </div>
  )
}

export default function HeroPhone() {
  return (
    <div className="relative flex items-center justify-center min-h-[390px] md:min-h-[440px]">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl" />

      <div className="relative w-full max-w-[560px] rounded-2xl border border-slate-700/50 bg-gradient-to-b from-[#0f172a] to-[#0b1220] p-5 md:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="text-slate-200 font-semibold text-sm md:text-base">Live Portfolio Snapshot</p>
          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">
            +4.83% Today
          </span>
        </div>

        <div className="h-44 md:h-48 mb-4">
          <LiveMarketWidget />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-700/40 bg-[#0a162d] p-3">
            <p className="text-[11px] text-slate-400">Copied Traders</p>
            <p className="text-white text-xl font-semibold mt-1">24</p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-[#0a162d] p-3">
            <p className="text-[11px] text-slate-400">Win Rate</p>
            <p className="text-emerald-400 text-xl font-semibold mt-1">71%</p>
          </div>
        </div>

        <p className="mt-3 text-[10px] text-slate-500 text-right">Live data powered by TradingView</p>
      </div>
    </div>
  )
}
