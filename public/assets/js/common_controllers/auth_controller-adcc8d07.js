import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['passwordInput', 'flash'];

  connect() {
    const tab = new URLSearchParams(document.location.search).get('tab') || document.location.hash.replace('#', '')
    if (tab === 'password') {
      this.use_password();
    } else {
      this.use_magic();
    }
  }

  all_elements() {
    return this.element.querySelectorAll('[data-auth-visible-if]')
  }

  show_elements(type) {
    const visibleElements = Array.from(this.element.querySelectorAll(`[data-auth-visible-if='${type}']`))
    const allElements = Array.from(this.all_elements())

    allElements.forEach(el => {
      el.classList.toggle('hidden', !visibleElements.includes(el))
    })

    window.history.replaceState(null, '', `#${type}`)
  }

  hideFlash() {
    if (this.hasFlashTarget) {
      this.flashTarget.hidden = true
    }
  }

  use_password(e) {
    e?.preventDefault();
    if (e) this.hideFlash();
    this.show_elements('password');

    this.passwordInputTarget.setAttribute('required', 'required');
    this.passwordInputTarget.setAttribute('autocomplete', 'current-password');
    this.passwordInputTarget.setAttribute('name', 'user[password]')
    this.passwordInputTarget.focus();
  }

  use_magic(e) {
    e?.preventDefault();
    if (e) this.hideFlash();
    this.show_elements('magic');

    this.passwordInputTarget.removeAttribute('required');
    this.passwordInputTarget.setAttribute('autocomplete', 'off');
    this.passwordInputTarget.removeAttribute('name')
    this.passwordInputTarget.value = '';
  }
}
