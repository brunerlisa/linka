export const MARKETING_TABS = [
  { id: 'standard', label: 'Standard' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'nfp', label: 'NFP' },
  { id: 'btc', label: 'BTC' },
]

export const MARKETING_PLANS = {
  standard: [
    { title: 'STANDARD PLAN', pips: '20% - 25% PIPS', min: '$3,000.00', max: '$4,999.00' },
    { title: 'MASTER PLAN', pips: '25% - 30% PIPS', min: '$5,000.00', max: '$9,999.00', recommended: true },
    { title: 'PREMIUM PLAN', pips: '30% - 35% PIPS', min: '$10,000.00', max: '$19,999.00' },
    { title: 'ULTIMATE PLAN', pips: '35% - 40% PIPS', min: '$20,000.00', max: '$49,999.00' },
    { title: 'CORPORATE PLAN', pips: '40% - 45% PIPS', min: '$50,000.00', max: '$100,000,000.00' },
  ],
  advanced: [
    { title: 'STANDARD PLAN', pips: '30% - 40% PIPS', min: '$1,000.00', max: '$9,999.00' },
    { title: 'MASTER PLUS PLAN', pips: '40% - 45% PIPS', min: '$10,000.00', max: '$19,999.00', recommended: true },
    { title: 'PREMIUM PLAN', pips: '50% - 60% PIPS', min: '$20,000.00', max: '$49,999.00' },
    { title: 'ULTIMATE PLAN', pips: '60% - 70% PIPS', min: '$50,000.00', max: '$99,999.00' },
    { title: 'CORPORATE PLAN', pips: '40% - 45% PIPS', min: '$50,000.00', max: '$100,000,000.00' },
  ],
  nfp: [
    { title: 'PREMIUM PLAN', pips: '150% PIPS', min: '$100,000.00', max: '$149,999.00' },
    { title: 'STARTER PLAN', pips: '100% - 124% PIPS', min: '$50,000.00', max: '$99,999.00', recommended: true },
    { title: 'ULTIMATE PLAN', pips: '200% PIPS', min: '$150,000.00', max: '$10,000,000.00' },
  ],
  btc: [
    { title: 'STANDARD CRYPTO', pips: '70% - 75% PIPS', min: '5.00 BTC', max: '14.90 BTC' },
    { title: 'PREMIUM CRYPTO', pips: '80% - 85% PIPS', min: '15.00 BTC', max: '29.90 BTC' },
    { title: 'PRO CRYPTO', pips: '90% - 95% PIPS', min: '30.00 BTC', max: '500.00 BTC', recommended: true },
    { title: 'BASIC CRYPTO', pips: '65% - 70% PIPS', min: '1.00 BTC', max: '1.50 BTC' },
  ],
}

const yes = true
const no = false

export const UPGRADE_FEATURES = [
  { key: 'marketData', label: 'Real-time Market Data', bronze: yes, silver: yes, gold: yes },
  { key: 'basicCharts', label: 'Basic Charting Tools', bronze: yes, silver: yes, gold: yes },
  { key: 'copyTrading', label: 'Copy Trading', bronze: yes, silver: yes, gold: yes },
  { key: 'support', label: 'Standard Support', bronze: yes, silver: yes, gold: yes },
  { key: 'bots', label: 'Automated Trading Bots', bronze: no, silver: yes, gold: yes },
  { key: 'advancedCharts', label: 'Advanced Charting & Indicators', bronze: no, silver: yes, gold: yes },
  { key: 'spreads', label: 'Reduced Spreads', bronze: no, silver: yes, gold: yes },
  { key: 'api', label: 'API Access', bronze: no, silver: yes, gold: yes },
  { key: 'education', label: 'Educational Resources', bronze: no, silver: yes, gold: yes },
  { key: 'priority', label: '24/7 Priority Support', bronze: no, silver: no, gold: yes },
  { key: 'risk', label: 'Risk Management Tools', bronze: no, silver: no, gold: yes },
  { key: 'leverage', label: 'Max Leverage', bronze: '1x', silver: '5x', gold: 'unlimited' },
]

export const UPGRADE_PLANS = [
  {
    id: 'bronze',
    name: 'Bronze',
    min: 3000,
    max: 5000,
    priceLabel: '$3,000.00 — $5,000.00',
    summary: 'Perfect for getting started with professional trading tools.',
    leverage: '1x',
    websitePlan: 'STANDARD PLAN',
    extraCount: 0,
    accent: {
      icon: 'text-orange-400 bg-orange-500/15',
      button: 'bg-orange-500 hover:bg-orange-400 text-white',
      ring: 'ring-orange-400/40',
    },
  },
  {
    id: 'silver',
    name: 'Silver',
    min: 5000,
    max: 50000,
    priceLabel: '$5,000.00 — $50,000.00',
    summary: 'Advanced tools and reduced fees for active traders.',
    leverage: '5x',
    websitePlan: 'MASTER — ULTIMATE',
    extraCount: 4,
    accent: {
      icon: 'text-slate-200 bg-slate-400/15',
      button: 'bg-primary hover:bg-primary-dark text-white',
      ring: 'ring-primary/40',
    },
  },
  {
    id: 'gold',
    name: 'Gold',
    min: 50000,
    max: null,
    priceLabel: '$50,000.00+',
    summary: 'Premium experience with unlimited leverage and priority support.',
    leverage: 'unlimited',
    websitePlan: 'CORPORATE PLAN',
    extraCount: 7,
    accent: {
      icon: 'text-amber-300 bg-amber-400/15',
      button: 'bg-amber-400 hover:bg-amber-300 text-[#1a1408]',
      ring: 'ring-amber-400/40',
    },
  },
]

export const BASIC_PLAN_ID = 'basic'

export function getUpgradePlan(id) {
  return UPGRADE_PLANS.find((plan) => plan.id === String(id || '').toLowerCase()) || null
}

export function planDisplayName(id, status) {
  const plan = getUpgradePlan(id)
  const name = plan?.name || 'Basic'
  if (String(status || '').toLowerCase() === 'pending') return `${name} pending`
  return `${name} account`
}

export function qualifiesForPlan(balance, plan) {
  const amount = Number(balance || 0)
  if (!plan) return false
  return amount >= Number(plan.min || 0)
}
