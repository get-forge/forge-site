import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['tab', 'toggle']

  connect() {
    this.activeTab = this.element.dataset.defaultTab

    const hash = new URLSearchParams(document.location.search).get('tab') || document.location.hash.replace('#', '')
    for (const tab of this.tabTargets) {
      if (tab.dataset.tab === hash) {
        this.activeTab = hash
        break
      }
    }

    this.switchTabListener = this.switchTabEvent.bind(this)
    this.element.addEventListener('switch-tab', this.switchTabListener)
    this.applyClasses()
  }

  disconnect() {
    this.element.removeEventListener('switch-tab', this.switchTabListener)
  }

  switch(e) {
    e.preventDefault()
    this.switchTab(e.currentTarget.dataset.tab)
  }

  switchTabEvent(event) {
    this.switchTab(event.detail.tab)
  }

  switchTab(tab) {
    this.activeTab = tab
    this.applyClasses()
  }

  applyClasses() {
    for (const toggle of this.toggleTargets) {
      toggle.dataset.active
        .split(' ')
        .forEach((className) =>
          toggle.classList.toggle(
            className,
            toggle.dataset.tab === this.activeTab
          )
        )
    }

    for (const tab of this.tabTargets) {
      tab.classList.toggle('hidden', tab.dataset.tab !== this.activeTab)
    }
  }
}
