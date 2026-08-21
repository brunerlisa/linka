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
      <section className="relative flex flex-col min-h-0 lg:min-h-[90vh] pt-[4.75rem] lg:pt-28 pb-0 lg:pb-36 overflow-x-clip lg:overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none hidden lg:block" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/6 to-transparent lg:hidden" />

        <div className="relative z-[1] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10 w-full max-w-[1280px] xl:max-w-[1400px] mx-auto px-4 sm:px-6 xl:px-10 pt-6 lg:pt-0 pb-6 lg:pb-0 flex-1 min-w-0">
          <div className="min-w-0 lg:flex-1 lg:basis-[58%] w-full">
            <h1
              className="
              font-bold tracking-[-0.03em] text-white
              text-[2rem] leading-[1.12] sm:text-4xl sm:leading-[1.1]
              lg:text-[76px] xl:text-[82px] lg:tracking-[-0.025em] lg:leading-[0.92]
            "
            >
              <span className="block xl:whitespace-nowrap">Innovative Copy</span>
              <span className="block xl:whitespace-nowrap">Trading Platform</span>
              <span className="block xl:whitespace-nowrap">
                for{' '}
                <RotatingWord />
              </span>
            </h1>

            <div className="mt-5 lg:mt-6 flex flex-wrap gap-x-4 gap-y-3 lg:gap-6">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary shrink-0" aria-hidden>
                  <PeopleIcon className="w-4 h-4" />
                </span>
                <span className="text-white font-semibold text-sm lg:text-base xl:text-lg">
                  1,007,000+ Active Users
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 shrink-0" aria-hidden>
                  <StarIcon className="w-4 h-4" />
                </span>
                <span className="text-white font-semibold text-sm lg:text-base xl:text-lg">
                  4.5 Google Rating
                </span>
              </div>
            </div>

            <p className="mt-5 lg:mt-6 text-slate-300 text-[15px] sm:text-base lg:text-lg leading-relaxed max-w-[680px]">
              A Platform With Endless Possibilities. When Experts trade, you trade. If they profit, you profit too. Open your account in minutes!
            </p>

            <div className="mt-6 lg:mt-7">
              <Link
                href="/auth/sign-up"
                className="
                  inline-flex items-center justify-center rounded-xl font-semibold
                  bg-primary hover:bg-primary-dark text-white transition-colors
                  w-full sm:w-auto min-h-12 px-6 py-3.5 text-base
                  lg:px-6 lg:py-3.5 lg:text-lg
                "
              >
                Get Started
              </Link>
            </div>
          </div>

          <div className="min-w-0 w-full lg:flex-1 lg:basis-[42%] flex justify-center lg:justify-end xl:justify-center xl:pr-4">
            <HeroPhone responsiveDensity />
          </div>
        </div>

        <StockTicker />
      </section>

      <section className="py-12 lg:py-20 border-y border-dark-border bg-dark-card/30">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-w-0">
          <div className="text-center mb-8 lg:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">Everything you need to copy trade</h2>
            <p className="mt-3 text-slate-400 text-[15px] lg:text-base max-w-2xl mx-auto">
              Calendar, signals, automation, and rewards — in one dark-fintech workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 min-w-0">
            {featuresGrid.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="p-5 lg:p-6 rounded-xl bg-dark-card border border-dark-border hover:border-primary/30 transition-colors text-left min-w-0"
              >
                <div className="w-12 h-12 rounded-lg border-2 border-primary flex items-center justify-center mb-4 text-primary shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">
                  {description}
                </p>
                <Link
                  href="/auth/sign-up"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors"
                >
                  Find out more →
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

      <section className="py-14 lg:py-20 border-t border-dark-border">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 min-w-0 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 lg:mb-4">Ready to copy the best?</h2>
          <p className="text-slate-400 text-[15px] lg:text-base mb-6 lg:mb-8">
            Join thousands of investors who trade smarter with Noble Mirror Capital.
          </p>
          <Link
            href="/auth/sign-up"
            className="inline-flex items-center justify-center w-full sm:w-auto min-h-12 px-8 py-3.5 text-base font-medium rounded-xl bg-primary hover:bg-primary-dark text-white transition-colors"
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
