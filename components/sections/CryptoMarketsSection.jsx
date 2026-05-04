import Image from 'next/image'

/** Official-style color marks (spothq cryptocurrency-icons). Order matches premium light reference. */
const ROW1 = [
  { file: 'matic.svg', label: 'Polygon (MATIC)' },
  { file: 'avax.svg', label: 'Avalanche' },
  { file: 'bnb.svg', label: 'Binance Coin' },
  { file: 'bch.svg', label: 'Bitcoin Cash' },
  { file: 'btc.svg', label: 'Bitcoin' },
  { file: 'btt.svg', label: 'BitTorrent' },
  { file: 'dash.svg', label: 'Dash' },
]

const ROW2 = [
  { file: 'doge.svg', label: 'Dogecoin' },
  { file: 'eth.svg', label: 'Ethereum' },
  { file: 'kcs.svg', label: 'KuCoin Token' },
  { file: 'ltc.svg', label: 'Litecoin' },
  { file: 'xmr.svg', label: 'Monero' },
  { file: 'ppc.svg', label: 'Peercoin' },
  { file: 'xpm.svg', label: 'Primecoin' },
]

const ROW3 = [{ file: 'zec.svg', label: 'Zcash' }]

function CryptoIcon({ file, label }) {
  return (
    <div
      className="
        shrink-0 flex items-center justify-center
        w-[4.25rem] h-[4.25rem] sm:w-[4.75rem] sm:h-[4.75rem] lg:w-20 lg:h-20
        rounded-full bg-white
        shadow-[0_12px_40px_-12px_rgba(15,23,42,0.14),0_4px_14px_-4px_rgba(15,23,42,0.1)]
        ring-1 ring-slate-200/90
        p-2.5 sm:p-3
      "
      title={label}
    >
      <Image
        src={`/crypto-brands/${file}`}
        alt={label}
        width={56}
        height={56}
        className="w-full h-full object-contain select-none"
        unoptimized
      />
    </div>
  )
}

export default function CryptoMarketsSection() {
  return (
    <section className="relative border-t border-slate-200/90 bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 lg:py-28 px-4 sm:px-8 lg:px-10 overflow-x-clip">
      <div className="max-w-6xl xl:max-w-7xl mx-auto text-center px-2">
        <h2 className="text-slate-900 text-[clamp(1.25rem,3.4vw,2.25rem)] lg:text-[2.125rem] font-bold tracking-tight mb-12 lg:mb-16 max-w-3xl mx-auto leading-tight">
          All Crypto Markets at Your Fingertips
        </h2>

        <div className="flex flex-col items-center gap-y-12 sm:gap-y-14 lg:gap-y-16">
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-x-10 sm:gap-y-11 lg:gap-x-12 lg:gap-y-12">
            {ROW1.map(({ file, label }) => (
              <CryptoIcon key={file} file={file} label={label} />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-x-10 sm:gap-y-11 lg:gap-x-12 lg:gap-y-12">
            {ROW2.map(({ file, label }) => (
              <CryptoIcon key={file} file={file} label={label} />
            ))}
          </div>
          <div className="flex justify-center pt-1">
            {ROW3.map(({ file, label }) => (
              <CryptoIcon key={file} file={file} label={label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
