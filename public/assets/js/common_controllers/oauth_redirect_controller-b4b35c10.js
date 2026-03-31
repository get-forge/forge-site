import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['defaultState', 'redirectingState']

  submit() {
    this.defaultStateTarget.classList.add('hidden')
    this.redirectingStateTarget.classList.remove('hidden')
  }
}
