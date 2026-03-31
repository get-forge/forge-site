import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['form']

  removeDevBar() {
    document.querySelectorAll('.js-dev-bar').forEach((e) => e.remove())
  }

  roleChanged(e) {
    this.formTarget.submit()
  }
}
