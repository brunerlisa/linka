'use client'

import { useEffect, useRef, useState } from 'react'
import { ChartErrorBoundary } from '@/components/ChartErrorBoundary'

export default function TradingViewChart({ symbol = 'NASDAQ:AAPL' }) {
  return (
    <ChartErrorBoundary>
      <ChartFrame symbol={symbol} />
    </ChartErrorBoundary>
  )
}

function ChartFrame({ symbol }) {
  const containerRef = useRef(null)
  const [chartError, setChartError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    setChartError(false)
    container.innerHTML = ''

    const widgetHost = document.createElement('div')
    widgetHost.className = 'tradingview-widget-container'
    widgetHost.style.height = '100%'
    widgetHost.style.width = '100%'

    const widgetNode = document.createElement('div')
    widgetNode.className = 'tradingview-widget-container__widget'
    widgetNode.style.height = 'calc(100% - 32px)'
    widgetNode.style.width = '100%'
    widgetHost.appendChild(widgetNode)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.text = JSON.stringify({
      autosize: true,
      symbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: true,
      calendar: false,
      hide_volume: false,
      support_host: 'https://www.tradingview.com',
      backgroundColor: '#050a14',
      gridColor: 'rgba(148,163,184,0.08)',
      withdateranges: true,
    })
    widgetHost.appendChild(script)
    container.appendChild(widgetHost)

    const healthCheck = window.setTimeout(() => {
      if (!container.querySelector('iframe')) setChartError(true)
    }, 6000)

    return () => window.clearTimeout(healthCheck)
  }, [symbol])

  return (
    <div className="relative h-[420px] lg:h-[560px] rounded-2xl border border-dark-border overflow-hidden bg-[#050a14]">
      <div ref={containerRef} className="h-full w-full" />
      {chartError ? (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-slate-400 px-4 text-center bg-[#050a14]">
          Unable to load the chart. Refresh the page or disable a script blocker.
        </div>
      ) : null}
    </div>
  )
}
