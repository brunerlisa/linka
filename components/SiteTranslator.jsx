'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { LANG_STORAGE_KEY, SITE_LANGUAGES, detectBrowserLanguage } from '@/lib/siteLanguages'

function readSavedLang() {
  try {
    return localStorage.getItem(LANG_STORAGE_KEY) || ''
  } catch {
    return ''
  }
}

function writeSavedLang(code) {
  try {
    localStorage.setItem(LANG_STORAGE_KEY, code)
  } catch {
    // ignore
  }
}

function setTranslateCookie(code) {
  const value = code === 'en' ? '/en/en' : `/en/${code}`
  const host = window.location.hostname
  const root = host.replace(/^www\./, '')
  const parts = [`googtrans=${value};path=/`]
  if (host) parts.push(`googtrans=${value};path=/;domain=${host}`)
  if (root && root !== host) parts.push(`googtrans=${value};path=/;domain=.${root}`)
  parts.forEach((cookie) => {
    document.cookie = cookie
  })
}

function applyGoogleCombo(code) {
  const combo = document.querySelector('select.goog-te-combo')
  if (!combo) return false
  if (combo.value !== code) {
    combo.value = code
    combo.dispatchEvent(new Event('change'))
  }
  return true
}

function resolveInitialLang() {
  const saved = readSavedLang()
  if (saved && SITE_LANGUAGES.some((item) => item.code === saved)) return saved
  const detected = detectBrowserLanguage()
  writeSavedLang(detected)
  return detected
}

function hideGoogleTranslateChrome() {
  const selectors = [
    '.goog-te-banner-frame',
    'iframe.goog-te-banner-frame',
    'iframe.skiptranslate',
    'body > .skiptranslate',
    '.VIpgJd-ZVi9od-ORHb',
    '.VIpgJd-ZVi9od-ORHb-OEVmcd',
    '.VIpgJd-yAWNEb-L7lbkb',
    'iframe[class*="VIpgJd"]',
    '[class*="VIpgJd-ZVi9od-ORHb"]',
    '#goog-gt-tt',
    '.goog-te-spinner-pos',
  ]
  selectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      if (node.id === 'google_translate_element' || node.classList?.contains('site-translate-engine')) return
      node.style.setProperty('display', 'none', 'important')
      node.style.setProperty('visibility', 'hidden', 'important')
      node.style.setProperty('height', '0', 'important')
    })
  })
  document.documentElement.style.setProperty('top', '0', 'important')
  document.documentElement.style.setProperty('margin-top', '0', 'important')
  document.body?.style.setProperty('top', '0', 'important')
  document.body?.style.setProperty('margin-top', '0', 'important')
}

export function LanguageSwitcher({ className = '', compact = false }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    setLang(resolveInitialLang())
    function onChange(event) {
      if (event.detail?.code) setLang(event.detail.code)
    }
    window.addEventListener('nmc:lang', onChange)
    return () => window.removeEventListener('nmc:lang', onChange)
  }, [])

  function onPick(code) {
    setLang(code)
    writeSavedLang(code)
    setTranslateCookie(code)
    window.dispatchEvent(new CustomEvent('nmc:apply-lang', { detail: { code } }))
    if (!applyGoogleCombo(code)) {
      window.location.reload()
    }
  }

  return (
    <label className={`notranslate inline-flex items-center shrink-0 ${compact ? 'gap-1' : 'gap-2'} ${className}`}>
      <span className="sr-only">Language</span>
      <svg className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} text-slate-300 shrink-0`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
          d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.5-2.4 4-5.6 4-9s-1.5-6.6-4-9m0 18c-2.5-2.4-4-5.6-4-9s1.5-6.6 4-9m-7.5 9h15"
        />
      </svg>
      <select
        value={lang}
        onChange={(e) => onPick(e.target.value)}
        className={
          compact
            ? 'w-[5.4rem] max-w-[5.4rem] h-8 rounded-md bg-[#0b1220] border border-dark-border px-1.5 text-[11px] text-white'
            : 'max-w-[9.5rem] h-9 rounded-lg bg-[#0b1220] border border-dark-border px-2 text-xs text-white'
        }
        aria-label="Translate this site"
      >
        {SITE_LANGUAGES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export default function SiteTranslateEngine() {
  useEffect(() => {
    const lang = resolveInitialLang()
    setTranslateCookie(lang)

    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          autoDisplay: false,
        },
        'google_translate_element'
      )
      window.setTimeout(() => applyGoogleCombo(lang), 400)
    }

    function onApply(event) {
      const code = event.detail?.code
      if (!code) return
      setTranslateCookie(code)
      if (!applyGoogleCombo(code)) window.location.reload()
    }
    hideGoogleTranslateChrome()
    const observer = new MutationObserver(hideGoogleTranslateChrome)
    observer.observe(document.documentElement, { childList: true, subtree: true })
    window.addEventListener('nmc:apply-lang', onApply)
    return () => {
      observer.disconnect()
      window.removeEventListener('nmc:apply-lang', onApply)
    }
  }, [])

  return (
    <>
      <div id="google_translate_element" className="site-translate-engine" aria-hidden />
      <Script
        id="google-translate"
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
    </>
  )
}
