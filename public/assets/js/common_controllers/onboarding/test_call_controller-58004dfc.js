import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['phoneInput']

  connect() {
    this.setValidateMessageBind = this.setValidateMessage.bind(this)
    this.setValidateMessage()

    this.phoneInputTarget.addEventListener('input', this.setValidateMessageBind)
  }

  disconnect() {
    this.phoneInputTarget.removeEventListener('input', this.setValidateMessageBind)
  }

  setValidateMessage() {
    if (this.phoneInputTarget.value === '') {
      this.phoneInputTarget.setCustomValidity('This field is required for incident alerting')
    } else {
      this.phoneInputTarget.setCustomValidity('')
    }
  }
}
