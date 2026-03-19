'use client'
import { useEffect, useRef, useState } from 'react'

export default function TradeMarketsSection() {
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
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js'
    script.async = true
    script.text = JSON.stringify({
      colorTheme: 'dark',
      dateRange: '12M',
      showChart: true,
      locale: 'en',
      width: '100%',
      height: '100%',
      largeChartUrl: '',
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      plotLineColorGrowing: 'rgba(34, 197, 94, 1)',
      plotLineColorFalling: 'rgba(248, 113, 113, 1)',
      gridLineColor: 'rgba(148,163,184,0.15)',
      scaleFontColor: 'rgba(148,163,184,0.9)',
      belowLineFillColorGrowing: 'rgba(34, 197, 94, 0.05)',
      belowLineFillColorFalling: 'rgba(248, 113, 113, 0.05)',
      belowLineFillColorGrowingBottom: 'rgba(34, 197, 94, 0)',
      belowLineFillColorFallingBottom: 'rgba(248, 113, 113, 0)',
      symbolActiveColor: 'rgba(37, 99, 235, 0.3)',
      tabs: [
        {
          title: 'Share CFDs',
          symbols: [
            { s: 'NASDAQ:META', d: 'Meta' },
            { s: 'NASDAQ:NFLX', d: 'Netflix' },
            { s: 'NASDAQ:AMZN', d: 'Amazon' },
            { s: 'NASDAQ:TSLA', d: 'Tesla' },
          ],
        },
        {
          title: 'Crypto',
          symbols: [
            { s: 'BINANCE:BTCUSDT', d: 'Bitcoin' },
            { s: 'BINANCE:ETHUSDT', d: 'Ethereum' },
            { s: 'BINANCE:SOLUSDT', d: 'Solana' },
            { s: 'BINANCE:XRPUSDT', d: 'XRP' },
          ],
        },
        {
          title: 'Forex',
          symbols: [
            { s: 'FX:EURUSD', d: 'EUR/USD' },
            { s: 'FX:GBPUSD', d: 'GBP/USD' },
            { s: 'FX:USDJPY', d: 'USD/JPY' },
            { s: 'FX:AUDUSD', d: 'AUD/USD' },
          ],
        },
        {
          title: 'Indices',
          symbols: [
            { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
            { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
            { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
            { s: 'FOREXCOM:UKXGBP', d: 'FTSE 100' },
          ],
        },
        {
          title: 'Commodities',
          symbols: [
            { s: 'OANDA:XAUUSD', d: 'Gold' },
            { s: 'OANDA:XAGUSD', d: 'Silver' },
            { s: 'TVC:USOIL', d: 'US Oil' },
            { s: 'TVC:UKOIL', d: 'Brent Oil' },
          ],
        },
      ],
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
    <section className="py-20 border-t border-dark-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Trade Global Markets at the Lowest Costs!
        </h2>
        <p className="text-slate-400 mb-8">
          Gain fast and easy access to 1000+ of the most liquid Currencies, Indices, Commodities, Share CFDs, ETFs and more with{' '}
          <span className="text-primary font-medium">PRIME ECN</span> spreads from <span className="text-primary font-medium">0.0 pips!</span>
        </p>

        <div className="relative h-[420px] rounded-xl bg-dark-card border border-dark-border overflow-hidden">
          <div ref={containerRef} className="h-full w-full" />
          {widgetError && (
            <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-slate-400 bg-[#050816]">
              Live market widget is blocked in this browser session. Disable strict script blockers or open in a normal
              browser tab to load TradingView live data.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
