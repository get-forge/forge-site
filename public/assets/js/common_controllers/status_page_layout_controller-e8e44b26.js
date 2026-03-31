import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['vertical', 'horizontal', 'verticalButton', 'horizontalButton']

  toggleVertical() {
    this.verticalButtonTarget.classList.add('layout-toggle-active')
    this.horizontalButtonTarget.classList.remove('layout-toggle-active')
    this.verticalTarget.classList.remove('hidden')
    this.horizontalTarget.classList.add('hidden')
  }

  toggleHorizontal() {
    this.horizontalButtonTarget.classList.add('layout-toggle-active')
    this.verticalButtonTarget.classList.remove('layout-toggle-active')
    this.horizontalTarget.classList.remove('hidden')
    this.verticalTarget.classList.add('hidden')
  }
}
