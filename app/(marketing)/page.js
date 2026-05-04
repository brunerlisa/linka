import Link from 'next/link'
import RotatingWord from '@/components/RotatingWord'
import HeroPhone from '@/components/HeroPhone'
import StockTicker from '@/components/StockTicker'
import StartCopyingSection from '@/components/sections/StartCopyingSection'
import PhoneFeaturesSection from '@/components/sections/PhoneFeaturesSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import LeadersSection from '@/components/sections/LeadersSection'
import GlobalMarketsCards from '@/components/sections/GlobalMarketsCards'
import TradeMarketsSection from '@/components/sections/TradeMarketsSection'
import CryptoMarketsSection from '@/components/sections/CryptoMarketsSection'
import PricingPlansSection from '@/components/sections/PricingPlansSection'
import SimpleStepsSection from '@/components/sections/SimpleStepsSection'
import PlatformCapabilitiesSection from '@/components/sections/PlatformCapabilitiesSection'
import OtherFeaturesBentoSection from '@/components/sections/OtherFeaturesBentoSection'
import RegulationPartnersSection from '@/components/sections/RegulationPartnersSection'
import {
  CalendarIcon,
  CheckSquareIcon,
  ChartLineIcon,
  ChatBubbleIcon,
  SignalIcon,
  CashbackIcon,
} from '@/components/icons/FeatureIcons'

const featuresGrid = [
  { title: 'Premium Economic Calendar', description: 'Start trading news like the pros with our pro economic calendar', Icon: CalendarIcon },
  { title: 'Technical Views', description: 'Access live trading setups based on pattern recognition and expert analysis.', Icon: CheckSquareIcon },
  { title: 'Alpha EA', description: 'Unlock live trading ideas with three EAs for your MT4 and MT5 platform.', Icon: ChartLineIcon },
  { title: 'AI Market Buzz', description: 'Gain live market-moving insights of over 35,000 tradable assets.', Icon: ChatBubbleIcon },
  { title: 'Trade Signals', description: 'Access daily trading ideas and technical setups in real-time.', Icon: SignalIcon },
  { title: 'Cashback Bonus', description: 'Get a 50% Cashback Bonus that converts to cash when you trade.', Icon: CashbackIcon },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-grid min-w-0 max-w-full overflow-x-clip">
      <section className="relative flex flex-col min-h-0 lg:min-h-[90vh] pt-11 lg:pt-28 pb-0 lg:pb-36 overflow-x-clip lg:overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none hidden lg:block" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/6 to-transparent lg:hidden" />

        {/* One hero row: 2-col dense on small screens → classic wide row on lg+ (single HeroPhone / one TradingView embed) */}
        <div
          className={`relative z-[1] grid grid-cols-2 gap-x-2 gap-y-2 sm:gap-x-3 items-start lg:flex lg:flex-row lg:items-center lg:gap-10 w-full max-w-[1280px] xl:max-w-[1400px] mx-auto px-2 sm:px-2.5 xl:px-10 pt-3 lg:pt-0 pb-2 lg:pb-0 flex-1 min-w-0`}
        >
          <div className="min-w-0 lg:flex-1 lg:basis-[58%]">
            <h1
              className="
              font-bold tracking-[-0.03em] text-white
              text-[clamp(0.92rem,3.9vw,2.05rem)] leading-[1.06]
              lg:text-[76px] xl:text-[82px] lg:tracking-[-0.025em] lg:leading-[0.92]
            "
            >
              <span className="block xl:whitespace-nowrap">Innovative Copy</span>
              <span className="block xl:whitespace-nowrap">Trading Platform</span>
              <span className="block xl:whitespace-nowrap">
                for <RotatingWord className="max-lg:min-w-[4.25ch]" />
              </span>
            </h1>

            <div className="mt-1.5 lg:mt-6 flex flex-wrap gap-x-2 gap-y-1 lg:gap-6">
              <div className="flex items-center gap-1 lg:gap-2">
                <span className="flex items-center justify-center w-5 h-5 lg:w-8 lg:h-8 rounded-full bg-primary/20 text-primary shrink-0" aria-hidden>
                  <PeopleIcon className="w-2.5 h-2.5 lg:w-4 lg:h-4" />
                </span>
                <span className="text-white font-medium lg:font-semibold text-[9px] sm:text-[10px] lg:text-base xl:text-lg max-lg:whitespace-nowrap">
                  <span className="lg:hidden">1,007,000+ Users</span>
                  <span className="hidden lg:inline">1,007,000+ Active Users</span>
                </span>
              </div>
              <div className="flex items-center gap-1 lg:gap-2">
                <span className="flex items-center justify-center w-5 h-5 lg:w-8 lg:h-8 rounded-full bg-amber-500/20 text-amber-400 shrink-0" aria-hidden>
                  <StarIcon className="w-2.5 h-2.5 lg:w-4 lg:h-4" />
                </span>
                <span className="text-white font-medium lg:font-semibold text-[9px] sm:text-[10px] lg:text-base xl:text-lg max-lg:whitespace-nowrap">
                  <span className="lg:hidden">4.5 Google</span>
                  <span className="hidden lg:inline">4.5 Google Rating</span>
                </span>
              </div>
            </div>

            <p className="mt-1.5 lg:mt-6 text-slate-400 lg:text-slate-300 text-[9px] sm:text-[10px] lg:text-lg leading-snug lg:leading-relaxed lg:max-w-[680px]">
              <span className="lg:hidden">
                A Platform With Endless Possibilities. When Experts trade, you trade. Open your account in minutes!
              </span>
              <span className="hidden lg:inline">
                A Platform With Endless Possibilities. When Experts trade, you trade. If they profit, you profit too. Open your account in minutes!
              </span>
            </p>

            <div className="mt-2 lg:mt-7">
              <Link
                href="/auth/sign-up"
                className="
                  inline-flex items-center justify-center rounded-md lg:rounded-lg font-semibold lg:font-semibold
                  bg-primary hover:bg-primary-dark text-white transition-colors
                  px-2.5 py-1.5 text-[10px] sm:text-[11px]
                  lg:px-6 lg:py-3.5 lg:text-lg
                "
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="min-w-0 lg:flex-1 lg:basis-[42%] flex justify-center lg:justify-end xl:justify-center xl:pr-4">
            <HeroPhone responsiveDensity />
          </div>
        </div>

        <StockTicker />
      </section>

      <section className="py-6 lg:py-20 border-y border-dark-border bg-dark-card/30">
        <div className="w-full max-w-[1180px] lg:max-w-7xl mx-auto px-2 sm:px-2.5 lg:px-8 min-w-0">
          <div className="text-center mb-3 lg:mb-10">
            <h2 className="text-[clamp(0.95rem,3vw,1.5rem)] lg:text-3xl font-bold text-white">Everything you need to copy trade</h2>
            <p className="mt-1 lg:mt-2 text-slate-500 lg:text-slate-400 text-[9px] sm:text-[10px] lg:text-base max-w-2xl mx-auto">
              Calendar, signals, automation, and rewards — in one dark-fintech workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-1 sm:gap-1.5 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 min-w-0">
            {featuresGrid.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="p-1.5 sm:p-2 lg:p-6 rounded-md lg:rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 transition-colors text-left min-w-0"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-12 lg:h-12 rounded-md lg:rounded-lg border lg:border-2 border-primary flex items-center justify-center mb-1 lg:mb-4 text-primary shrink-0">
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                </div>
                <h3 className="text-[9px] sm:text-[10px] lg:text-lg font-bold text-white mb-0.5 lg:mb-2 leading-tight max-lg:line-clamp-3">
                  {title}
                </h3>
                <p className="text-slate-500 lg:text-slate-400 text-[8px] sm:text-[9px] lg:text-sm leading-snug lg:leading-relaxed mb-1 lg:mb-4 max-lg:line-clamp-4">
                  {description}
                </p>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-0.5 lg:gap-1 text-[8px] sm:text-[9px] lg:text-sm font-medium text-primary hover:text-primary-light transition-colors"
                >
                  <span className="lg:hidden">more →</span>
                  <span className="hidden lg:inline">Find out more →</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <StartCopyingSection />
      <PhoneFeaturesSection />
      <BenefitsSection />
      <PlatformCapabilitiesSection />
      <LeadersSection />
      <GlobalMarketsCards />
      <TradeMarketsSection />
      <CryptoMarketsSection />
      <PricingPlansSection />
      <OtherFeaturesBentoSection />
      <SimpleStepsSection />
      <RegulationPartnersSection />

      <section className="py-8 lg:py-20 border-t border-dark-border">
        <div className="w-full max-w-[1180px] lg:max-w-4xl mx-auto px-2 sm:px-2.5 lg:px-6 min-w-0 text-center">
          <h2 className="text-base sm:text-lg lg:text-3xl font-bold text-white mb-1 lg:mb-4">Ready to copy the best?</h2>
          <p className="text-slate-500 lg:text-slate-400 text-[10px] sm:text-[11px] lg:text-base mb-4 lg:mb-8">
            Join thousands of investors who trade smarter with Noble Mirror Capital.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center px-4 py-2 text-[11px] lg:px-8 lg:py-4 lg:text-base font-medium rounded-md lg:rounded-lg bg-primary hover:bg-primary-dark text-white transition-colors"
          >
            Get Started on the Platform
          </Link>
        </div>
      </section>
    </div>
  )
}

function PeopleIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  )
}

function StarIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}
