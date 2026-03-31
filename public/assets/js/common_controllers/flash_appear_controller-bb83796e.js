import { Controller } from '@hotwired/stimulus'

// Animates flash messages on appear, providing visual feedback when
// the same validation error is shown on repeated form submissions.
export default class extends Controller {
  connect() {
    if (!this.element.children.length) return

    this.element.style.opacity = '0'
    this.element.style.transform = 'translateY(-4px)'

    requestAnimationFrame(() => {
      this.element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
      this.element.style.opacity = '1'
      this.element.style.transform = 'translateY(0)'
    })
  }
}
