import { Controller } from '@hotwired/stimulus'
import Cookies from 'js-cookie'

export default class extends Controller {
  static targets = ['title']

  toggle(e) {
    document.body.classList.toggle('side-nav-collapsed')
    Cookies.set('side-nav-collapsed', document.body.classList.contains('side-nav-collapsed'), {
      domain: `.${window.location.hostname.split('.').slice(-2).join('.')}`
    })
  }

  toggleGroup(e) {
    e.currentTarget.querySelector('svg').classList.toggle('rotate-90')
    e.currentTarget.closest('[role="group"]').querySelector('[data-submenu]').classList.toggle('hidden')
  }
}
