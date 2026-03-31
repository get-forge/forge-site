import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect() {
    this.clickListener = this.onClick.bind(this)
    this.element.addEventListener('click', this.clickListener)
  }

  disconnect() {
    this.element.removeEventListener('click', this.clickListener)
  }

  onClick(event) {
    event.preventDefault();

    if (this.element.dataset.trigger === 'dispatch') {
      document.getElementById(this.element.dataset.modal).dispatchEvent(new CustomEvent('modal:toggle'));
    } else {
      window.toggleModal(this.element.dataset.modal)
    }

    if (this.element.dataset.focus) {
      document.getElementById(this.element.dataset.modal).querySelector(this.element.dataset.focus).focus();
    }
  }
}
