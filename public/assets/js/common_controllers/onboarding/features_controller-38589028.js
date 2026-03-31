import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['form', 'button']

  connect() {
    this.enableButton()
  }

  selectFeature() {
    this.enableButton()
  }

  enableButton() {
    const checkboxes = this.formTarget.querySelectorAll('input[type="checkbox"]')
    const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked)

    this.buttonTargets.forEach(button => {
      button.disabled = !anyChecked
    })
  }
}
