import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['yearlyToggle', 'yearly', 'monthly', 'bundleRadio', 'submitButton']

  connect() {
    // reset to yearly if form is refreshed
    this.period = 'yearly'
    this.region = 'germany' // Default region
    this.yearlyToggleTarget.checked = true
    this.boundHandleRadioChange = this.handleRadioChange.bind(this)
    this.bundleRadioTargets.forEach(target => target.addEventListener('change', this.boundHandleRadioChange))

    this.abortController = new AbortController()
    document.addEventListener('pricing:region-select', (event) => {
      this.region = event.detail
      this.updateVisibility()
    }, { signal: this.abortController.signal })
  }

  disconnect() {
    this.bundleRadioTargets.forEach(target => target.removeEventListener('change', this.boundHandleRadioChange))
    this.abortController.abort()
  }

  handleRadioChange(event) {
    this.submitButtonTarget.disabled = false
  }

  updatePeriod(event) {
    this.period = event.target.checked ? 'yearly' : 'monthly'
    this.updatePricesAndLabels()
  }

  updatePricesAndLabels() {
    this.updateVisibility()
  }

  updateVisibility() {
    const allTargets = this.monthlyTargets.concat(this.yearlyTargets)
    const previousBundleName = allTargets.map(label =>
      label.querySelector('input[type=radio]:checked')?.dataset?.bundleName
    ).find(Boolean)

    this.yearlyTargets.forEach(yearly => {
      const radio = yearly.querySelector('input[type=radio]')
      const region = radio?.dataset?.region

      if (region && region !== this.region) {
        yearly.classList.add('hidden')
      } else {
        yearly.classList.toggle('hidden', this.period !== 'yearly')
      }

      if (radio?.dataset?.bundleName === previousBundleName && this.period === 'yearly' && region === this.region) {
        radio.checked = true
      }
    })

    this.monthlyTargets.forEach(monthly => {
      const radio = monthly.querySelector('input[type=radio]')
      const region = radio?.dataset?.region

      if (region && region !== this.region) {
        monthly.classList.add('hidden')
      } else {
        monthly.classList.toggle('hidden', this.period !== 'monthly')
      }

      if (radio?.dataset?.bundleName === previousBundleName && this.period === 'monthly' && region === this.region) {
        radio.checked = true
      }
    })
  }
}
