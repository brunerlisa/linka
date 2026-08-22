export function parseTradeNotes(notes) {
  if (!notes) return {}
  try {
    const parsed = JSON.parse(notes)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return { raw: String(notes) }
  }
}

export function isUserPlacedTrade(row) {
  const notes = parseTradeNotes(row?.notes)
  return notes.kind === 'user_trade' || ['buy', 'sell'].includes(String(row?.result || '').toLowerCase())
}

export function toTvSymbol(input) {
  const raw = String(input || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '')
  if (!raw) return 'NASDAQ:AAPL'

  const aliases = {
    AAPL: 'NASDAQ:AAPL',
    TSLA: 'NASDAQ:TSLA',
    MSFT: 'NASDAQ:MSFT',
    GOOGL: 'NASDAQ:GOOGL',
    AMZN: 'NASDAQ:AMZN',
    NVDA: 'NASDAQ:NVDA',
    META: 'NASDAQ:META',
    'BTC/USD': 'BINANCE:BTCUSDT',
    BTCUSD: 'BINANCE:BTCUSDT',
    BTCUSDT: 'BINANCE:BTCUSDT',
    BTC: 'BINANCE:BTCUSDT',
    'ETH/USD': 'BINANCE:ETHUSDT',
    ETHUSD: 'BINANCE:ETHUSDT',
    ETHUSDT: 'BINANCE:ETHUSDT',
    ETH: 'BINANCE:ETHUSDT',
    'SOL/USD': 'BINANCE:SOLUSDT',
    SOLUSD: 'BINANCE:SOLUSDT',
    XAUUSD: 'OANDA:XAUUSD',
    'XAU/USD': 'OANDA:XAUUSD',
    GOLD: 'OANDA:XAUUSD',
  }
  if (aliases[raw]) return aliases[raw]
  if (raw.includes(':')) return raw
  if (raw.includes('/')) {
    const [base, quote] = raw.split('/')
    if (['USD', 'USDT', 'USDC'].includes(quote)) return `BINANCE:${base}USDT`
    return `FX:${base}${quote}`
  }
  if (/^[A-Z]{1,5}$/.test(raw)) return `NASDAQ:${raw}`
  return raw
}
