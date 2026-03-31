// Cookie consent auto-grant for non-EU users
// Handles: country detection, consent auto-granting, event dispatching
// Runs on all pages to ensure tracking initializes everywhere

// Export utilities for reuse by banner module
export const CONSENT_COOKIE_NAME = 'cookie_consent'

export async function fetchCountryData() {
  // Stub for local use: avoid network request that can hang
  return { eu: false }
}

export function getCookie(name) {
  const nameEQ = `${name}=`
  const cookies = document.cookie.split(';')
  for (let cookie of cookies) {
    cookie = cookie.trim()
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length)
    }
  }
  return null
}

export function dispatchConsentEvent(consentType) {
  const event = new CustomEvent('cookie-consent-granted', {
    detail: { consentType }
  })
  document.dispatchEvent(event)
}

class SiteSettingsBootstrap {
  constructor() {
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized) return
    this.isInitialized = true

    const existingConsent = getCookie(CONSENT_COOKIE_NAME)

    // If user already has consent preference, respect it
    if (existingConsent === 'accept_all' || existingConsent === 'accept_required' || existingConsent === 'denied') {
      if (existingConsent === 'accept_all') {
        dispatchConsentEvent('accept_all')
      } else if (existingConsent === 'accept_required') {
        dispatchConsentEvent('accept_required')
      }
      return
    }

    // No existing consent - check country and auto-grant for non-EU
    this.checkCountryAndAutoGrant()
  }

  async checkCountryAndAutoGrant() {
    try {
      let countryData = window.countryData

      // Fetch country data if not cached (allows VPN testing)
      if (!countryData) {
        countryData = await fetchCountryData()
        window.countryData = countryData
      }

      // Auto-grant consent for non-EU users
      if (!countryData.eu) {
        dispatchConsentEvent('accept_all')
      }
      // For EU users: do nothing, let banner handle it
    } catch (error) {
      // On error, do nothing (assume EU, let banner show)
    }
  }
}

// Initialize on every page load and Turbo navigation
function initializeConsentAutoGrant() {
  if (!window.cookieConsentAutoGrant) {
    window.cookieConsentAutoGrant = new SiteSettingsBootstrap()
  }
  window.cookieConsentAutoGrant.init()
}

// Initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeConsentAutoGrant)
} else {
  initializeConsentAutoGrant()
}

// Handle Turbo navigation
document.addEventListener('turbo:load', initializeConsentAutoGrant)

export default SiteSettingsBootstrap
