import { Controller } from '@hotwired/stimulus'
import { onboarding_calculate_path } from 'routes'
import { isIOS } from 'utils/platformDetection'

export default class extends Controller {
  static targets = ['toggleLink', 'calculationResultFrame']
  static values = { isYearly: Boolean, telemetryBundleId: String }

  connect() {
    this.loadPlanPrice()
  }

  toggle(event) {
    event.stopPropagation()
    event.preventDefault()
    this.isYearlyValue = !this.isYearlyValue
    this.loadPlanPrice()

    this.toggleLinkTarget.innerHTML = this.isYearlyValue
      ? 'Switch to monthly billing'
      : 'Switch to yearly billing (get ~2 months free)'
  }

  loadPlanPrice() {
    if (!this.loadingPlaceholder) {
      this.loadingPlaceholder = this.calculationResultFrameTarget.innerHTML
    } else {
      const currentTaxType = this.calculationResultFrameTarget.querySelector('#formatted-tax-type')?.innerHTML
      const hasTaxes = this.calculationResultFrameTarget.querySelector('.js-tax-present')

      this.calculationResultFrameTarget.innerHTML = this.loadingPlaceholder

      const newTaxTypeElement = this.calculationResultFrameTarget.querySelector('#formatted-tax-type')
      if (currentTaxType && newTaxTypeElement) {
        newTaxTypeElement.innerHTML = currentTaxType
      }
      if (!hasTaxes) {
        this.calculationResultFrameTarget.querySelectorAll('.js-tax-present').forEach((element) => {
          element.remove()
        })
      }
    }

    const params = new URLSearchParams()
    params.append('yearly', this.isYearlyValue)
    params.append('telemetry-bundle', this.telemetryBundleIdValue)
    if (isIOS()) {
      params.append('minimum-responder-licenses', 2)
    }

    this.calculationResultFrameTarget.src = onboarding_calculate_path() + '?' + params.toString()
  }
}
