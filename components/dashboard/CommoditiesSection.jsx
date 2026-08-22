'use client'

import { useState } from 'react'
import TradingViewChart from '@/components/dashboard/TradingViewChart'
import TradingViewEmbed from '@/components/dashboard/TradingViewEmbed'

const COMMODITIES = [
  { label: 'Gold', symbol: 'TVC:GOLD' },
  { label: 'Silver', symbol: 'TVC:SILVER' },
  { label: 'Crude Oil', symbol: 'TVC:USOIL' },
  { label: 'Brent', symbol: 'TVC:UKOIL' },
  { label: 'Natural Gas', symbol: 'NYMEX:NG1!' },
  { label: 'Copper', symbol: 'COMEX:HG1!' },
  { label: 'Wheat', symbol: 'CBOT:ZW1!' },
  { label: 'Corn', symbol: 'CBOT:ZC1!' },
]

export default function CommoditiesSection() {
  const [symbol, setSymbol] = useState('TVC:GOLD')

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-white">Commodities</h1>
        <p className="mt-1 text-sm text-slate-400">
          Live market heatmap by asset class, plus real commodity prices.
        </p>
      </div>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Market heatmap</h2>
        <TradingViewEmbed
          src="embed-widget-stock-heatmap.js"
          height={720}
          config={{
            exchanges: [],
            dataSource: 'AllUS',
            grouping: 'asset_class',
            blockSize: 'volume',
            blockColor: 'change',
            locale: 'en',
            symbolUrl: '',
            colorTheme: 'dark',
            hasTopBar: true,
            isDataSetEnabled: true,
            isZoomEnabled: true,
            hasSymbolTooltip: true,
            isMonoSize: false,
            width: '100%',
            height: '100%',
          }}
        />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Commodity quotes</h2>
        <TradingViewEmbed
          src="embed-widget-market-quotes.js"
          height={420}
          config={{
            width: '100%',
            height: '100%',
            locale: 'en',
            colorTheme: 'dark',
            isTransparent: true,
            showSymbolLogo: true,
            symbolsGroups: [
              {
                name: 'Commodities',
                symbols: COMMODITIES.map((item) => ({ name: item.symbol, displayName: item.label })),
              },
            ],
          }}
        />
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {COMMODITIES.map((item) => {
            const active = symbol === item.symbol
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
          key={`info-${symbol}`}
          src="embed-widget-symbol-info.js"
          height={240}
          config={{
            symbol,
            width: '100%',
            locale: 'en',
            colorTheme: 'dark',
            isTransparent: true,
          }}
        />
        <TradingViewChart key={`chart-${symbol}`} symbol={symbol} />
      </section>
    </div>
  )
}
