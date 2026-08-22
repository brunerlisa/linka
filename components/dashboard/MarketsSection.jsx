'use client'

import { useMemo, useState } from 'react'
import TradingViewChart from '@/components/dashboard/TradingViewChart'
import TradingViewEmbed from '@/components/dashboard/TradingViewEmbed'
import { toTvSymbol } from '@/lib/userTrade'

const WATCHLIST = [
  { label: 'AAPL', symbol: 'NASDAQ:AAPL' },
  { label: 'NVDA', symbol: 'NASDAQ:NVDA' },
  { label: 'MSFT', symbol: 'NASDAQ:MSFT' },
  { label: 'AMZN', symbol: 'NASDAQ:AMZN' },
  { label: 'GOOGL', symbol: 'NASDAQ:GOOGL' },
  { label: 'TSLA', symbol: 'NASDAQ:TSLA' },
  { label: 'META', symbol: 'NASDAQ:META' },
  { label: 'INTC', symbol: 'NASDAQ:INTC' },
]

const TAPE_SYMBOLS = [
  { proName: 'NASDAQ:NVDA', title: 'NVDA' },
  { proName: 'NASDAQ:MSFT', title: 'MSFT' },
  { proName: 'NASDAQ:AMZN', title: 'AMZN' },
  { proName: 'NASDAQ:GOOGL', title: 'GOOGL' },
  { proName: 'NASDAQ:AAPL', title: 'AAPL' },
  { proName: 'NASDAQ:TSLA', title: 'TSLA' },
  { proName: 'NASDAQ:META', title: 'META' },
  { proName: 'NASDAQ:INTC', title: 'INTC' },
]

const DARK_CHART_COLORS = {
  colorTheme: 'dark',
  isTransparent: true,
  locale: 'en',
  plotLineColorGrowing: 'rgba(0, 174, 239, 1)',
  plotLineColorFalling: 'rgba(239, 68, 68, 1)',
  gridLineColor: 'rgba(148, 163, 184, 0.12)',
  scaleFontColor: 'rgba(148, 163, 184, 0.9)',
  belowLineFillColorGrowing: 'rgba(0, 174, 239, 0.12)',
  belowLineFillColorFalling: 'rgba(239, 68, 68, 0.12)',
  belowLineFillColorGrowingBottom: 'rgba(0, 174, 239, 0)',
  belowLineFillColorFallingBottom: 'rgba(239, 68, 68, 0)',
  symbolActiveColor: 'rgba(0, 174, 239, 0.16)',
}

export default function MarketsSection() {
  const [symbol, setSymbol] = useState('NASDAQ:AAPL')
  const [customSymbol, setCustomSymbol] = useState('')

  const resolvedSymbol = useMemo(() => toTvSymbol(symbol), [symbol])

  function applyCustomSymbol(event) {
    event.preventDefault()
    if (!customSymbol.trim()) return
    setSymbol(toTvSymbol(customSymbol.trim()))
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">Markets</h1>
        <p className="mt-1 text-sm text-slate-400">Live prices, movers, and the economic calendar.</p>
      </div>

      <TradingViewEmbed
        src="embed-widget-ticker-tape.js"
        height={48}
        className="rounded-xl"
        config={{
          symbols: TAPE_SYMBOLS,
          showSymbolLogo: true,
          isTransparent: true,
          displayMode: 'adaptive',
          colorTheme: 'dark',
          locale: 'en',
        }}
      />

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Market summary</h2>
        <TradingViewEmbed
          src="embed-widget-hotlists.js"
          height={430}
          config={{
            exchange: 'US',
            dateRange: '12M',
            showChart: true,
            largeChartUrl: '',
            showSymbolLogo: true,
            showFloatingTooltip: true,
            width: '100%',
            height: '100%',
            ...DARK_CHART_COLORS,
          }}
        />
      </section>

      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <h2 className="text-lg font-semibold text-white">Stock overview</h2>
          <form onSubmit={applyCustomSymbol} className="flex gap-2">
            <input
              value={customSymbol}
              onChange={(e) => setCustomSymbol(e.target.value)}
              placeholder="Search ticker, e.g. AAPL"
              className="h-10 w-full sm:w-56 rounded-md bg-[#0b1220] border border-slate-700 px-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-primary"
            />
            <button type="submit" className="h-10 px-4 rounded-md bg-primary hover:bg-primary-dark text-sm font-semibold text-white">
              Open
            </button>
          </form>
        </div>
        <div className="flex flex-wrap gap-2">
          {WATCHLIST.map((item) => {
            const active = resolvedSymbol === item.symbol
            return (
              <button
                key={item.symbol}
                type="button"
                onClick={() => setSymbol(item.symbol)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  active
                    ? 'bg-primary/15 border-primary text-primary'
                    : 'border-dark-border text-slate-300 hover:border-primary/40'
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
        <TradingViewEmbed
          key={`info-${resolvedSymbol}`}
          src="embed-widget-symbol-info.js"
          height={280}
          config={{
            symbol: resolvedSymbol,
            width: '100%',
            locale: 'en',
            colorTheme: 'dark',
            isTransparent: true,
          }}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Price chart</h2>
        <TradingViewChart key={`chart-${resolvedSymbol}`} symbol={resolvedSymbol} />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Economic calendar</h2>
        <TradingViewEmbed
          src="embed-widget-events.js"
          height={560}
          config={{
            colorTheme: 'dark',
            isTransparent: true,
            locale: 'en',
            countryFilter: 'ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu',
            importanceFilter: '-1,0,1',
            width: '100%',
            height: '100%',
          }}
        />
      </section>
    </div>
  )
}
