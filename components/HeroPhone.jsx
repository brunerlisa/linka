'use client'
import { useEffect, useRef, useState } from 'react'

function LiveMarketWidget() {
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
    }, 8000)

    return () => {
      window.clearTimeout(healthCheck)
      container.innerHTML = ''
      setWidgetError(false)
    }
  }, [])

  return (
    <div className="relative h-full w-full min-h-0 overflow-hidden rounded-lg lg:rounded-xl border border-slate-700/40 bg-[#0a162d]">
      <div ref={containerRef} className="h-full w-full max-w-full min-h-[inherit] overflow-hidden [&_iframe]:max-w-full" />
      {widgetError && (
        <div className="absolute inset-0 flex items-center justify-center px-3 text-center text-[11px] text-slate-400 bg-[#0a162d]">
          Live quotes blocked or slow. Open in a normal tab or disable script blockers.
        </div>
      )}
    </div>
  )
}

/**
 * @param {{ dense?: boolean, responsiveDensity?: boolean }} props
 * `responsiveDensity` — dense card + shorter widget below lg; classic sizes at lg+
 */
export default function HeroPhone({ dense = false, responsiveDensity = false }) {
  const denseOnly = dense && !responsiveDensity
  const useResponsive = responsiveDensity

  const box = useResponsive
    ? 'p-4 sm:p-5 lg:p-6 rounded-2xl w-full mx-auto max-w-none lg:max-w-[560px] lg:mx-0'
    : denseOnly
      ? 'p-2 sm:p-2.5 rounded-lg'
      : 'p-5 md:p-6 rounded-2xl'

  const title = useResponsive
    ? 'text-sm lg:text-base'
    : denseOnly
      ? 'text-[10px] sm:text-[11px]'
      : 'text-sm md:text-base'

  const widgetH = useResponsive
    ? 'h-[200px] sm:h-[220px] lg:h-44 xl:h-48'
    : denseOnly
      ? 'h-[142px] sm:h-[150px]'
      : 'h-44 md:h-48'

  const wrap = useResponsive
    ? 'min-h-0 w-full lg:min-h-[390px]'
    : denseOnly
      ? 'min-h-0'
      : 'min-h-[390px] md:min-h-[440px]'

  const badge = useResponsive
    ? 'text-xs px-2 py-1 lg:text-[11px]'
    : denseOnly
      ? 'text-[9px] sm:text-[10px]'
      : 'text-[11px]'

  return (
    <div className={`relative flex items-center justify-center max-w-full min-w-0 overflow-x-clip ${wrap}`}>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-primary/10 to-transparent blur-3xl" />

      <div className={`relative w-full min-w-0 border border-slate-700/50 bg-gradient-to-b from-[#0f172a] to-[#0b1220] shadow-xl lg:shadow-2xl ${box}`}>
        <div className="flex items-center justify-between gap-2 mb-3 lg:mb-4">
          <p className={`text-slate-200 font-semibold ${title} min-w-0`}>
            Live Portfolio Snapshot
          </p>
          <span
            className={`text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full shrink-0 ${badge}`}
          >
            +4.83% Today
          </span>
        </div>

        <div className={`${widgetH} mb-3 lg:mb-4 min-w-0`}>
          <LiveMarketWidget />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-slate-700/40 bg-[#0a162d] p-3">
            <p className="text-xs text-slate-400 leading-tight">Copied Traders</p>
            <p className="text-white text-xl font-semibold mt-1 leading-none">24</p>
          </div>
          <div className="rounded-lg border border-slate-700/40 bg-[#0a162d] p-3">
            <p className="text-xs text-slate-400 leading-tight">Win Rate</p>
            <p className="text-emerald-400 text-xl font-semibold mt-1 leading-none">71%</p>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-slate-500 text-right">
          Live data powered by TradingView
        </p>
      </div>
    </div>
  )
}
