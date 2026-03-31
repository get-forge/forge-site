import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ["form", "submit"]

  connect() {
    const submitEventHandler = (event) => {
      for (const target of this.submitTargets) {
        window.disableElement(target)
      }

      window.submittedRecaptchaForm = this.formTarget

      if (event.detail?.skipRecaptcha) {
        return true
      }

      // Skip recaptcha for worktree and workbench domains and force local submission
      if ((window.location.hostname.includes('worktree') && window.location.hostname.endsWith('.test')) ||
          (window.location.hostname.includes('workbench') && window.location.hostname.endsWith('.example.dev'))) {
        // Convert remote form to local submission to avoid Turbo redirect issues
        this.formTarget.removeAttribute('data-remote')
        this.formTarget.dataset.turbo = 'false'
        return true
      }

      event.preventDefault()

      if (window.recaptchaLoaded) {
        grecaptcha.execute()
      } else {
        this.loadRecaptcha().then((_msg) => grecaptcha.execute())
      }
    }

    this.formTarget.removeEventListener("submit", submitEventHandler)
    this.formTarget.addEventListener("submit", submitEventHandler)
  }

  loadRecaptcha() {
    const scriptUrl = "https://www.google.com/recaptcha/api.js?onload=recaptcha_onload"

    return new Promise((resolve) => {
      const scriptTag = document.createElement("script")
      scriptTag.src = scriptUrl
      scriptTag.onload = () => { window.recaptchaLoaded = true }
      window.recaptchaAfterRender = resolve
      document.querySelector("head").appendChild(scriptTag)
    })
  }
}
