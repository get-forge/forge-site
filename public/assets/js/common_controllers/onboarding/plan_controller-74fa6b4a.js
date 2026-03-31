import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['plan', 'button']

  connect() {
    this.updateButtonLabel()
  }

  selectPlan() {
    this.updateButtonLabel()
  }

  updateButtonLabel() {
    const selectedPlan = this.planTargets.find(plan => plan.checked)
    if (selectedPlan?.value === 'paid') {
      this.buttonTarget.textContent = 'Continue with a 60-day money-back guarantee'
    } else {
      this.buttonTarget.textContent = 'Continue'
    }
  }
}
