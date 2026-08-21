import Image from 'next/image'

const COINS = [
  { file: 'btc.svg', label: 'Bitcoin' },
  { file: 'eth.svg', label: 'Ethereum' },
  { file: 'bnb.svg', label: 'Binance Coin' },
  { file: 'avax.svg', label: 'Avalanche' },
  { file: 'matic.svg', label: 'Polygon (MATIC)' },
  { file: 'ltc.svg', label: 'Litecoin' },
  { file: 'doge.svg', label: 'Dogecoin' },
  { file: 'bch.svg', label: 'Bitcoin Cash' },
]

function CryptoIcon({ file, label }) {
  return (
    <div
      className="
        shrink-0 flex items-center justify-center
        w-12 h-12 sm:w-14 sm:h-14
        rounded-full bg-white
        shadow-[0_8px_24px_rgba(0,0,0,0.35)]
        ring-1 ring-white/10
        p-2
      "
      title={label}
    >
      <Image
        src={`/crypto-brands/${file}`}
        alt={label}
        width={40}
        height={40}
        className="w-full h-full object-contain select-none"
        unoptimized
      />
    </div>
  )
}

export default function CryptoMarketsSection() {
  return (
    <section className="relative border-t border-dark-border bg-dark py-10 lg:py-16 px-4 sm:px-6 lg:px-8 overflow-x-clip">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-white text-2xl sm:text-3xl font-bold tracking-tight mb-6 lg:mb-8 leading-tight">
          All Crypto Markets at Your Fingertips
        </h2>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-5">
          {COINS.map(({ file, label }) => (
            <CryptoIcon key={file} file={file} label={label} />
          ))}
        </div>
      </div>
    </section>
  )
}
