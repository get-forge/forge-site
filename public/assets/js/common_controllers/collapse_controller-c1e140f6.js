import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['content', 'toggle']

  toggle(e) {
    e.preventDefault()
    e.currentTarget.classList.toggle("open")

    if (this.hasToggleTarget) {
      this.toggleTarget.classList.toggle('rotate-90')
    }

    for (const el of this.contentTargets) {
      el.classList.toggle("hidden")
    }
  }
}
