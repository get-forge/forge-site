// Cookie consent banner UI
// Handles: banner display, button interactions
// Auto-grant logic is handled by site_settings_bootstrap.js

import { CONSENT_COOKIE_NAME, getCookie, fetchCountryData, dispatchConsentEvent } from 'common/site_settings_bootstrap'

class SiteSettingsPanel {
  constructor() {
    this.cookieExpiryDays = 365
    this.isInitialized = false
  }

  init() {
    if (this.isInitialized === true) {
      return
    }
    const banner = document.getElementById('cookie-consent-banner')
    if (!banner) {
      return
    }

    // Don't show if user already has consent preference
    const existingConsent = getCookie(CONSENT_COOKIE_NAME)
    if (existingConsent === 'accept_all' || existingConsent === 'accept_required' || existingConsent === 'denied') {
      this.isInitialized = true
      return
    }

    this.isInitialized = true
    this.checkCountryAndShowBanner()
  }

  async checkCountryAndShowBanner() {
    try {
      let countryData = window.countryData

      if (!countryData) {
        countryData = await fetchCountryData()
        window.countryData = countryData
      }

      if (countryData.eu) {
        this.showBanner()
      }
    } catch (error) {
      // Show banner on error to be safe (assume EU)
      this.showBanner()
    }
  }

  showBanner() {
    const banner = document.getElementById('cookie-consent-banner')
    if (banner) {
      banner.classList.remove('hidden')
      this.attachEventListeners()
    }
  }

  hideBanner() {
    const banner = document.getElementById('cookie-consent-banner')
    if (banner) {
      banner.classList.add('hidden')
    }
  }

  attachEventListeners() {
    const acceptAllBtn = document.getElementById('cookie-accept-all')
    const acceptRequiredBtn = document.getElementById('cookie-accept-required')
    const denyBtn = document.getElementById('cookie-deny')

    if (acceptAllBtn) {
      acceptAllBtn.addEventListener('click', () => this.handleAcceptAll())
    }

    if (acceptRequiredBtn) {
      acceptRequiredBtn.addEventListener('click', () => this.handleAcceptRequired())
    }

    if (denyBtn) {
      denyBtn.addEventListener('click', () => this.handleDeny())
    }
  }

  handleAcceptAll() {
    console.log('accept all')
    this.setCookie(CONSENT_COOKIE_NAME, 'accept_all', this.cookieExpiryDays)
    this.hideBanner()
    dispatchConsentEvent('accept_all')
  }

  handleAcceptRequired() {
    this.setCookie(CONSENT_COOKIE_NAME, 'accept_required', this.cookieExpiryDays)
    this.hideBanner()
    dispatchConsentEvent('accept_required')
  }

  handleDeny() {
    alert('This site requires cookies for user authentication. You have to choose "Accept required" if you want to continue using our service. Thanks for understanding.')
  }

  setCookie(name, value, days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    const expires = `expires=${date.toUTCString()}`

    document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`
  }
}

// Initialize on every page load and Turbo navigation
function initializeConsentBanner() {
  if (!window.cookieConsentBanner) {
    window.cookieConsentBanner = new SiteSettingsPanel()
  }
  window.cookieConsentBanner.init()
}

// Initial load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeConsentBanner)
} else {
  initializeConsentBanner()
}

// Handle Turbo navigation
document.addEventListener('turbo:load', initializeConsentBanner)

// Export for module usage
export default SiteSettingsPanel
