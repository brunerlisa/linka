import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const TOTAL_STEPS = 9

export default function Onboarding() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const storageKey = `onboarding:${user?.email || user?.id || 'guest'}`

  const [step, setStep] = useState(0)
  const [showSummary, setShowSummary] = useState(false)

  // Answers
  const [userIntent, setUserIntent] = useState('')
  const [tradingExperience, setTradingExperience] = useState('')
  const [investmentGoal, setInvestmentGoal] = useState('')
  const [riskTolerance, setRiskTolerance] = useState('')
  const [investmentAmount, setInvestmentAmount] = useState('')
  const [copyStyle, setCopyStyle] = useState('')
  const [marketInterest, setMarketInterest] = useState('')
  const [successDefinition, setSuccessDefinition] = useState('')
  const [country, setCountry] = useState('')
  const [agreed, setAgreed] = useState(false)

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return

    function checkProfile() {
      const saved = localStorage.getItem(storageKey)
      if (!saved) return
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.has_onboarded) {
          navigate('/dashboard', { replace: true })
        }
      } catch {
        // Ignore malformed local data and allow onboarding flow.
      }
    }

    checkProfile()
  }, [user, navigate, storageKey])

  if (!user) return null

  const canGoBack = step > 0 && !showSummary

  const currentAnswer = () => {
    switch (step) {
      case 0:
        return userIntent
      case 1:
        return tradingExperience
      case 2:
        return investmentGoal
      case 3:
        return riskTolerance
      case 4:
        return investmentAmount
      case 5:
        return copyStyle
      case 6:
        return marketInterest
      case 7:
        return successDefinition
      case 8:
        return country && agreed
      default:
        return true
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) return

    if (!currentAnswer()) return

    // Still stepping through questions
    if (step < TOTAL_STEPS - 1) {
      setStep((prev) => prev + 1)
      return
    }

    // Last step – save and show summary
    setLoading(true)

    const answers = {
      userIntent,
      tradingExperience,
      investmentGoal,
      riskTolerance,
      investmentAmount,
      copyStyle,
      marketInterest,
      successDefinition,
      country,
    }

    const investorType =
      investmentGoal === 'Balanced growth'
        ? 'Balanced Growth Investor'
        : investmentGoal === 'Slow and steady growth'
          ? 'Conservative Growth Investor'
          : investmentGoal === 'High risk / high return'
            ? 'Aggressive Growth Investor'
            : 'Opportunistic Trader'

    const riskLevel =
      riskTolerance === 'Low risk (stable traders)'
        ? 'Low'
        : riskTolerance === 'High risk (aggressive traders)'
          ? 'High'
          : 'Medium'

    const profileSummary = {
      investorType,
      riskLevel,
      preferredMarket: marketInterest,
      goal: userIntent,
    }

    const mainGoalSummary = JSON.stringify({
      answers,
      profileSummary,
    })

    localStorage.setItem(
      storageKey,
      JSON.stringify({
        user_id: user.id,
        email: user.email,
        comfort_level: riskLevel,
        main_goal: mainGoalSummary,
        has_onboarded: true,
        updated_at: new Date().toISOString(),
      }),
    )

    setLoading(false)
    setShowSummary(true)
  }

  if (showSummary) {
    const investorType =
      investmentGoal === 'Balanced growth'
        ? 'Balanced Growth Investor'
        : investmentGoal === 'Slow and steady growth'
          ? 'Conservative Growth Investor'
          : investmentGoal === 'High risk / high return'
            ? 'Aggressive Growth Investor'
            : 'Opportunistic Trader'

    const riskLevel =
      riskTolerance === 'Low risk (stable traders)'
        ? 'Low'
        : riskTolerance === 'High risk (aggressive traders)'
          ? 'High'
          : 'Medium'

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-4">
        <div className="w-full max-w-xl bg-[#070a1b] rounded-xl p-8 shadow-xl space-y-5">
          <h2 className="text-2xl font-semibold">Your investor profile</h2>
          <p className="text-sm text-slate-300">
            Here&apos;s how we&apos;ll tailor Noble Mirror Capital for you based on your answers.
          </p>

          <div className="rounded-lg border border-slate-800 bg-[#050816] p-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Investor type</span>
              <span className="font-medium text-slate-100">{investorType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Risk level</span>
              <span className="font-medium text-slate-100">{riskLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Preferred market</span>
              <span className="font-medium text-slate-100">{marketInterest || 'Mixed'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Main reason you joined</span>
              <span className="font-medium text-slate-100">{userIntent}</span>
            </div>
          </div>

          <p className="text-sm text-slate-300">
            You&apos;re all set - enter the dashboard to copy your trader and start making money on Noble Mirror Capital.
          </p>

          <button
            type="button"
            onClick={() => navigate('/dashboard', { replace: true })}
            className="w-full mt-2 py-2.5 rounded-md bg-[#4f46e5] hover:bg-[#4338ca] text-sm font-semibold"
          >
            Finish &amp; go to dashboard
          </button>
        </div>
      </div>
    )
  }

  const renderCardOptions = (options, value, onChange) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      {options.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={`text-left rounded-lg border px-4 py-3 transition-colors ${
            value === label
              ? 'border-[#4f46e5] bg-[#111827]'
              : 'border-slate-700 bg-[#050816] hover:bg-[#0b1020]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )

  const renderCountrySelect = () => {
    const countries = [
      'Afghanistan',
      'Albania',
      'Algeria',
      'Andorra',
      'Angola',
      'Argentina',
      'Armenia',
      'Australia',
      'Austria',
      'Azerbaijan',
      'Bahamas',
      'Bahrain',
      'Bangladesh',
      'Belarus',
      'Belgium',
      'Belize',
      'Benin',
      'Bhutan',
      'Bolivia',
      'Bosnia and Herzegovina',
      'Botswana',
      'Brazil',
      'Brunei',
      'Bulgaria',
      'Burkina Faso',
      'Burundi',
      'Cambodia',
      'Cameroon',
      'Canada',
      'Cape Verde',
      'Central African Republic',
      'Chad',
      'Chile',
      'China',
      'Colombia',
      'Comoros',
      'Costa Rica',
      'Croatia',
      'Cuba',
      'Cyprus',
      'Czech Republic',
      'Democratic Republic of the Congo',
      'Denmark',
      'Djibouti',
      'Dominican Republic',
      'Ecuador',
      'Egypt',
      'El Salvador',
      'Equatorial Guinea',
      'Eritrea',
      'Estonia',
      'Eswatini',
      'Ethiopia',
      'Finland',
      'France',
      'Gabon',
      'Gambia',
      'Georgia',
      'Germany',
      'Ghana',
      'Greece',
      'Guatemala',
      'Guinea',
      'Guinea-Bissau',
      'Guyana',
      'Haiti',
      'Honduras',
      'Hong Kong',
      'Hungary',
      'Iceland',
      'India',
      'Indonesia',
      'Iran',
      'Iraq',
      'Ireland',
      'Israel',
      'Italy',
      'Ivory Coast',
      'Jamaica',
      'Japan',
      'Jordan',
      'Kazakhstan',
      'Kenya',
      'Kuwait',
      'Kyrgyzstan',
      'Laos',
      'Latvia',
      'Lebanon',
      'Lesotho',
      'Liberia',
      'Libya',
      'Lithuania',
      'Luxembourg',
      'Madagascar',
      'Malawi',
      'Malaysia',
      'Maldives',
      'Mali',
      'Malta',
      'Mauritania',
      'Mauritius',
      'Mexico',
      'Moldova',
      'Monaco',
      'Mongolia',
      'Montenegro',
      'Morocco',
      'Mozambique',
      'Myanmar',
      'Namibia',
      'Nepal',
      'Netherlands',
      'New Zealand',
      'Nicaragua',
      'Niger',
      'Nigeria',
      'North Macedonia',
      'Norway',
      'Oman',
      'Pakistan',
      'Panama',
      'Paraguay',
      'Peru',
      'Philippines',
      'Poland',
      'Portugal',
      'Qatar',
      'Republic of the Congo',
      'Romania',
      'Russia',
      'Rwanda',
      'Saudi Arabia',
      'Senegal',
      'Serbia',
      'Seychelles',
      'Sierra Leone',
      'Singapore',
      'Slovakia',
      'Slovenia',
      'Somalia',
      'South Africa',
      'South Korea',
      'Spain',
      'Sri Lanka',
      'Sudan',
      'Sweden',
      'Switzerland',
      'Syria',
      'Taiwan',
      'Tajikistan',
      'Tanzania',
      'Thailand',
      'Togo',
      'Trinidad and Tobago',
      'Tunisia',
      'Turkey',
      'Uganda',
      'Ukraine',
      'United Arab Emirates',
      'United Kingdom',
      'United States',
      'Uruguay',
      'Uzbekistan',
      'Venezuela',
      'Vietnam',
      'Yemen',
      'Zambia',
      'Zimbabwe',
      'Other',
    ]

    return (
      <select
        className="w-full rounded-md bg-[#050816] border border-gray-700 px-3 py-2 text-sm"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      >
        <option value="">Select your country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050816] text-white px-4">
      <div className="w-full max-w-xl bg-[#070a1b] rounded-xl p-8 shadow-xl">
        <p className="text-xs text-slate-400 mb-1">
          Step {step + 1} of {TOTAL_STEPS}
        </p>
        <h2 className="text-2xl font-semibold mb-2">Let&apos;s set up your copy trading profile</h2>
        <p className="text-sm text-gray-300 mb-6">
          Answer a few quick questions so we can match you with traders and strategies that fit you.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 0 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">What brings you to copy trading today?</p>
              {renderCardOptions(
                [
                  'I want to earn passive income',
                  'I want to learn trading from professionals',
                  "I don't have time to trade myself",
                  'I want to diversify my investments',
                  "I'm curious and exploring",
                ],
                userIntent,
                setUserIntent,
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">How familiar are you with trading?</p>
              {renderCardOptions(
                [
                  "I'm completely new",
                  "I've watched trading but never traded",
                  "I've traded a little",
                  "I'm an experienced trader",
                ],
                tradingExperience,
                setTradingExperience,
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">What is your main investment goal?</p>
              {renderCardOptions(
                ['Slow and steady growth', 'Balanced growth', 'High risk / high return', 'Short-term profit'],
                investmentGoal,
                setInvestmentGoal,
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">How much risk are you comfortable taking?</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {[
                  'Low risk (stable traders)',
                  'Medium risk',
                  'High risk (aggressive traders)',
                ].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setRiskTolerance(label)}
                    className={`text-left rounded-lg border px-4 py-3 transition-colors ${
                      riskTolerance === label
                        ? 'border-[#4f46e5] bg-[#111827]'
                        : 'border-slate-700 bg-[#050816] hover:bg-[#0b1020]'
                    }`}
                  >
                    <p>{label}</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      {label.startsWith('Low')
                        ? 'Smaller returns but generally more stable.'
                        : label.startsWith('High')
                          ? 'Higher potential returns but larger drawdowns.'
                          : 'Balanced mix of risk and return.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">How much do you plan to start copy trading with?</p>
              {renderCardOptions(
                [
                  '$100 – $500',
                  '$500 – $2,000',
                  '$2,000 – $10,000',
                  '$10,000 – $50,000',
                  '$50,000 – $100,000+',
                ],
                investmentAmount,
                setInvestmentAmount,
              )}
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">How would you like to copy traders?</p>
              {renderCardOptions(
                [
                  'I already have who to copy ( The person that introduce me to the platform)',
                  'Automatically copy trades',
                  'Still learning — show me recommended traders',
                ],
                copyStyle,
                setCopyStyle,
              )}
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">Which markets interest you the most?</p>
              {renderCardOptions(
                ['Crypto', 'Forex', 'Stocks', 'Commodities', 'Mixed portfolio'],
                marketInterest,
                setMarketInterest,
              )}
            </div>
          )}

          {step === 7 && (
            <div className="space-y-3">
              <p className="text-sm font-medium">What would success look like for you?</p>
              {renderCardOptions(
                [
                  'Making my first profitable copy trade',
                  'Growing my portfolio steadily',
                  'Learning trading strategies',
                  'Building passive income',
                ],
                successDefinition,
                setSuccessDefinition,
              )}
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Country of residence</p>
                {renderCountrySelect()}
              </div>
              <div className="mt-2 space-y-2 border-t border-gray-800 pt-3">
                <p className="text-xs text-gray-300">
                  By continuing, you confirm that the information you&apos;ve provided is accurate and that you
                  understand copy trading involves risk and that past performance is not a guarantee of future
                  results.
                </p>
                <label className="flex items-center gap-2 text-xs text-gray-300">
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-gray-600 bg-[#050816]"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                  />
                  <span>I understand and agree. Take me to my dashboard.</span>
                </label>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              disabled={!canGoBack}
              onClick={() => canGoBack && setStep((prev) => prev - 1)}
              className={`px-4 py-2 rounded-md text-xs font-medium border ${
                canGoBack
                  ? 'border-gray-700 text-slate-200 hover:bg-[#111827]'
                  : 'border-gray-800 text-slate-500 cursor-default'
              }`}
            >
              Back
            </button>

            <button
              type="submit"
              disabled={loading || (step === 8 && (!country || !agreed))}
              className="px-6 py-2 rounded-md bg-[#4f46e5] hover:bg-[#4338ca] text-xs font-semibold disabled:opacity-70"
            >
              {loading ? 'Saving…' : step === 8 ? 'Finish' : 'Next'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

