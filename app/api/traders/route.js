import { requireAuth, requireAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

const nowIso = () => new Date().toISOString()

const DEFAULT_TRADERS = [
  { name: 'waltizinthestreet', risk: 'Low', style: 'Options', monthly_profit: 98, yearly_profit: 98, win_rate: 94, experience_years: 9, fee_percent: 10, min_capital: 30000, copiers: 223, status: 'ACTIVE', bio: 'Co-Founder COO Consultant/Advisor/Enthusiast.', avatar_url: '/traders/waltizinthestreet.jpg' },
  { name: 'Kieran - Darwinex', risk: 'Low', style: 'Mixed', monthly_profit: 98, yearly_profit: 98, win_rate: 95, experience_years: 11, fee_percent: 10, min_capital: 20000, copiers: 161, status: 'ACTIVE', bio: 'Head of UK Growth & Business Development at Darwinex.', avatar_url: '/traders/kieran-darwinex.jpg' },
  { name: 'StiOK - ESTN', risk: 'Low', style: 'Mixed', monthly_profit: 97, yearly_profit: 97, win_rate: 90, experience_years: 14, fee_percent: 10, min_capital: 25000, copiers: 190, status: 'ACTIVE', bio: 'Be the best.', avatar_url: '/traders/stiok-estn.jpg' },
  { name: 'Tannor M', risk: 'Low', style: 'Mixed', monthly_profit: 96, yearly_profit: 96, win_rate: 93, experience_years: 12, fee_percent: 10, min_capital: 35000, copiers: 129, status: 'ACTIVE', bio: 'Curious about tech, investing and where the world\'s headed. Subscribe to the Future Investing YT channel to stay in touch!', avatar_url: '/traders/tannor-m.jpg' },
  { name: 'Casey', risk: 'Low', style: 'Mixed', monthly_profit: 96, yearly_profit: 96, win_rate: 95, experience_years: 14, fee_percent: 10, min_capital: 50000, copiers: 91, status: 'ACTIVE', bio: 'Keep it low risk and consistent.', avatar_url: '/traders/casey.jpg' },
  { name: 'Enrich Trades', risk: 'Low', style: 'Mixed', monthly_profit: 96, yearly_profit: 95, win_rate: 93, experience_years: 12, fee_percent: 10, min_capital: 25000, copiers: 142, status: 'ACTIVE', bio: 'Experienced options trader with an executable trading strategy. I deliver high percentage of quality trades including day trades.', avatar_url: '/traders/enrich-trades.jpg' },
  { name: 'Tori trades', risk: 'Low', style: 'Mixed', monthly_profit: 95, yearly_profit: 96, win_rate: 92, experience_years: 10, fee_percent: 10, min_capital: 50000, copiers: 211, status: 'ACTIVE', bio: 'Full-time Futures Trader 10yrs of Trend Line Trading', avatar_url: '/traders/tori-trades.jpg' },
  { name: 'Trade Lab', risk: 'Low', style: 'Mixed', monthly_profit: 94, yearly_profit: 93, win_rate: 91, experience_years: 10, fee_percent: 10, min_capital: 10000, copiers: 53, status: 'ACTIVE', bio: 'Green always.', avatar_url: '/traders/trade-lab.jpg' },
  { name: 'Troymcneil', risk: 'Low', style: 'Mixed', monthly_profit: 93, yearly_profit: 92, win_rate: 95, experience_years: 8, fee_percent: 10, min_capital: 50000, copiers: 271, status: 'ACTIVE', bio: 'Trading with style.', avatar_url: '/traders/troymcneil.jpg' },
  { name: 'JPMERK', risk: 'Low', style: 'Options', monthly_profit: 93, yearly_profit: 92, win_rate: 91, experience_years: 6, fee_percent: 5, min_capital: 30000, copiers: 112, status: 'ACTIVE', bio: 'Options specialist.', avatar_url: '/traders/jpmerk.jpg' },
  { name: '[TI] Daniel', risk: 'Low', style: 'Mixed', monthly_profit: 93, yearly_profit: 95, win_rate: 93, experience_years: 14, fee_percent: 10, min_capital: 100000, copiers: 132, status: 'ACTIVE', bio: 'Daniel', avatar_url: '/traders/ti-daniel.jpg' },
  { name: 'Scotto', risk: 'Low', style: 'Mixed', monthly_profit: 93, yearly_profit: 97, win_rate: 88, experience_years: 11, fee_percent: 10, min_capital: 10000, copiers: 86, status: 'ACTIVE', bio: 'Scotto', avatar_url: '/traders/scotto.jpg' },
  { name: 'Dave', risk: 'Low', style: 'Forex', monthly_profit: 92, yearly_profit: 91, win_rate: 83, experience_years: 6, fee_percent: 10, min_capital: 50000, copiers: 123, status: 'ACTIVE', bio: 'Professional Trader', avatar_url: '/traders/dave.jpg' },
  { name: 'Trade with Pat', risk: 'High', style: 'Mixed', monthly_profit: 92, yearly_profit: 94, win_rate: 91, experience_years: 17, fee_percent: 10, min_capital: 15000, copiers: 291, status: 'ACTIVE', bio: 'Pat', avatar_url: '/traders/trade-with-pat.jpg' },
  { name: 'Max Gemini', risk: 'Medium', style: 'Mixed', monthly_profit: 91, yearly_profit: 94, win_rate: 90.2, experience_years: 13, fee_percent: 5, min_capital: 40000, copiers: 241, status: 'ACTIVE', bio: 'Expert trader, diverse portfolio.', avatar_url: '/traders/max-gemini.jpg' },
  { name: 'Max Ebert', risk: 'Low', style: 'Stocks', monthly_profit: 90, yearly_profit: 95, win_rate: 92, experience_years: 10, fee_percent: 10, min_capital: 50000, copiers: 171, status: 'ACTIVE', bio: 'https://growthpro-trading.com/', avatar_url: '/traders/max-ebert.jpg' },
  { name: 'Alex', risk: 'Low', style: 'Mixed', monthly_profit: 90, yearly_profit: 94, win_rate: 89, experience_years: 12, fee_percent: 10, min_capital: 50000, copiers: 68, status: 'ACTIVE', bio: 'alexchart', avatar_url: '/traders/alex.jpg' },
  { name: 'Will Trades', risk: 'Low', style: 'Mixed', monthly_profit: 90, yearly_profit: 94, win_rate: 91, experience_years: 9, fee_percent: 10, min_capital: 50000, copiers: 281, status: 'ACTIVE', bio: 'Will', avatar_url: '/traders/will-trades.jpg' },
  { name: 'Zack', risk: 'Low', style: 'Mixed', monthly_profit: 89, yearly_profit: 92, win_rate: 88, experience_years: 8, fee_percent: 10, min_capital: 20000, copiers: 42, status: 'ACTIVE', bio: 'zackhoop', avatar_url: '/traders/zack.jpg' },
  { name: 'Fanter', risk: 'Low', style: 'Mixed', monthly_profit: 89, yearly_profit: 94, win_rate: 92, experience_years: 14, fee_percent: 10, min_capital: 30000, copiers: 296, status: 'ACTIVE', bio: 'BillFanter', avatar_url: '/traders/fanter.jpg' },
  { name: 'Fadi', risk: 'Low', style: 'Mixed', monthly_profit: 88, yearly_profit: 89, win_rate: 92, experience_years: 11, fee_percent: 10, min_capital: 40000, copiers: 92, status: 'ACTIVE', bio: 'Fadizeidan', avatar_url: '/traders/fadi.jpg' },
  { name: 'kunal00', risk: 'Medium', style: 'Mixed', monthly_profit: 88, yearly_profit: 96, win_rate: 91, experience_years: 11, fee_percent: 10, min_capital: 10000, copiers: 393, status: 'ACTIVE', bio: 'The Guru to the Gurus', avatar_url: '/traders/kunal00.jpg' },
  { name: 'Gecko [Prime]', risk: 'Low', style: 'Mixed', monthly_profit: 87, yearly_profit: 90, win_rate: 92, experience_years: 10, fee_percent: 10, min_capital: 50000, copiers: 286, status: 'ACTIVE', bio: 'Just a lizard who <3 indicators.', avatar_url: '/traders/gecko-prime.jpg' },
  { name: 'PlaybookTrades', risk: 'Low', style: 'Mixed', monthly_profit: 86, yearly_profit: 93, win_rate: 90, experience_years: 9, fee_percent: 10, min_capital: 25000, copiers: 205, status: 'ACTIVE', bio: 'Co-Founder of trend analytics', avatar_url: '/traders/playbook-trades.jpg' },
  { name: 'david_hickson', risk: 'Low', style: 'Mixed', monthly_profit: 86, yearly_profit: 94, win_rate: 91, experience_years: 11, fee_percent: 10, min_capital: 100000, copiers: 184, status: 'ACTIVE', bio: 'Profit at max', avatar_url: '/traders/david-hickson.jpg' },
  { name: 'Kole', risk: 'Low', style: 'Mixed', monthly_profit: 86, yearly_profit: 91, win_rate: 89, experience_years: 8, fee_percent: 10, min_capital: 15000, copiers: 357, status: 'ACTIVE', bio: 'nqkole', avatar_url: '/traders/kole.jpg' },
  { name: 'Trader Tendies', risk: 'Medium', style: 'Stocks', monthly_profit: 82, yearly_profit: 88.1, win_rate: 90, experience_years: 11, fee_percent: 10, min_capital: 30000, copiers: 173, status: 'ACTIVE', bio: 'Pro Trader', avatar_url: '/traders/trader-tendies.jpg' },
  { name: 'TMI', risk: 'Low', style: 'Mixed', monthly_profit: 80, yearly_profit: 91, win_rate: 92, experience_years: 12, fee_percent: 10, min_capital: 20000, copiers: 521, status: 'ACTIVE', bio: 'TMI', avatar_url: '/traders/tmi.jpg' },
  { name: 'Casper', risk: 'Medium', style: 'Mixed', monthly_profit: 80, yearly_profit: 95, win_rate: 90, experience_years: 11, fee_percent: 10, min_capital: 30000, copiers: 151, status: 'ACTIVE', bio: 'Day Trading saved my life, now I\'m teaching you to do the same. Full course for free on YouTube', avatar_url: '/traders/casper.jpg' },
  { name: 'Speedyski', risk: 'Low', style: 'Mixed', monthly_profit: 82, yearly_profit: 85, win_rate: 88, experience_years: 8, fee_percent: 10, min_capital: 20000, copiers: 58, status: 'ACTIVE', bio: 'speedy', avatar_url: '/traders/speedyski.jpg' },
  { name: 'Davidn', risk: 'Low', style: 'Mixed', monthly_profit: 90, yearly_profit: 90, win_rate: 91, experience_years: 8, fee_percent: 10, min_capital: 50000, copiers: 147, status: 'ACTIVE', bio: 'Master the market.', avatar_url: '/traders/davidn.jpg' },
  { name: 'Brycen C', risk: 'Low', style: 'Mixed', monthly_profit: 90, yearly_profit: 90, win_rate: 91, experience_years: 9, fee_percent: 10, min_capital: 20000, copiers: 118, status: 'ACTIVE', bio: 'Brycen', avatar_url: '/traders/brycen-c.jpg' },
  { name: 'Stocky', risk: 'Medium', style: 'Mixed', monthly_profit: 90, yearly_profit: 92, win_rate: 88, experience_years: 10, fee_percent: 56, min_capital: 10000, copiers: 127, status: 'ACTIVE', bio: 'stockystockman', avatar_url: '/traders/stocky.jpg' },
  { name: 'Livi', risk: 'Low', style: 'Mixed', monthly_profit: 88, yearly_profit: 90, win_rate: 93, experience_years: 13, fee_percent: 15, min_capital: 30000, copiers: 491, status: 'ACTIVE', bio: 'VIP (lifetime)', avatar_url: '/traders/livi.jpg' },
]

export async function GET() {
  try {
    await requireAuth()
    const { data, error } = await supabaseAdmin.from('traders').select('*').order('created_at', { ascending: false })
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data || [])
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    throw e
  }
}

export async function POST(req) {
  try {
    await requireAdmin()
    const body = await req.json()
    if (body.action === 'seed') {
      await supabaseAdmin.from('traders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      for (const t of DEFAULT_TRADERS) {
        await supabaseAdmin.from('traders').insert(t)
      }
      const { data } = await supabaseAdmin.from('traders').select('*').order('created_at', { ascending: false })
      return Response.json(data || [])
    }
    const payload = { ...body, updated_at: nowIso() }
    if (payload.id) delete payload.id
    const { data, error } = await supabaseAdmin.from('traders').insert(payload).select().single()
    if (error) return Response.json({ error: error.message }, { status: 500 })
    return Response.json(data)
  } catch (e) {
    if (e.status === 401) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (e.status === 403) return Response.json({ error: 'Forbidden' }, { status: 403 })
    throw e
  }
}
