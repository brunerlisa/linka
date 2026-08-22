'use client'

import { useEffect } from 'react'
import Script from 'next/script'

const SMARTSUPP_KEY = 'dcda0b2064d37f0ed865f9f632d91292721494ed'

function removeSmartsuppDom() {
  const selectors = [
    '#chat-application',
    '#smartsupp-widget-container',
    'iframe[src*="smartsupp"]',
    '[id*="smartsupp"]',
    '[class*="smartsupp"]',
  ]
  document.querySelectorAll(selectors.join(',')).forEach((node) => node.remove())
}

export default function SmartsuppChat() {
  useEffect(() => {
    window._smartsupp = window._smartsupp || {}
    window._smartsupp.key = SMARTSUPP_KEY
    window._smartsupp.alignX = 'right'
    window._smartsupp.alignY = 'bottom'
    window._smartsupp.offsetX = 18
    window._smartsupp.offsetY = 18

    if (typeof window.smartsupp === 'function') {
      window.smartsupp('chat:show')
    }

    return () => {
      try {
        if (typeof window.smartsupp === 'function') {
          window.smartsupp('chat:hide')
        }
      } catch {
        // widget may already be gone
      }
      removeSmartsuppDom()
    }
  }, [])

  return (
    <Script
      id="smartsupp-loader"
      src="https://www.smartsuppchat.com/loader.js?"
      strategy="afterInteractive"
    />
  )
}
