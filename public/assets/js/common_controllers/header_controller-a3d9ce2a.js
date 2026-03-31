import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  connect() {
    this.toggleElements = this.element.querySelectorAll('[aria-controls]')
    this.boundToggle = this.toggle.bind(this)

    this.toggleElements.forEach(toggleElement => {
      toggleElement.addEventListener('click', this.boundToggle)
    })

    this.boundDocumentClick = this.handleDocumentClick.bind(this)
    document.addEventListener('click', this.boundDocumentClick)
  }

  disconnect() {
    this.toggleElements?.forEach(toggleElement => {
      toggleElement.removeEventListener('click', this.boundToggle)
    })
    document.removeEventListener('click', this.boundDocumentClick)
  }

  toggle(event) {
    if (!window.matchMedia("(pointer: coarse)").matches) return

    if (event.target.closest('a')) {
      return
    }

    event.preventDefault()

    const targetElementId = event.currentTarget.getAttribute('aria-controls')
    const trigger = event.currentTarget
    const container = trigger.parentElement

    this.element.querySelectorAll('[role="menu"]:not(.hidden)').forEach(menu => {
      if (menu.id !== targetElementId) {
        menu.classList.add('hidden')
        const otherTrigger = this.element.querySelector(`[aria-controls="${menu.id}"]`)
        otherTrigger?.parentElement?.removeAttribute('data-open')
      }
    })

    const targetElement = document.getElementById(targetElementId)
    const isHidden = targetElement?.classList?.toggle('hidden')

    container?.toggleAttribute('data-open', !isHidden)
  }

  handleDocumentClick(event) {
    if (!window.matchMedia("(pointer: coarse)").matches) return

    const isInsideDropdown = event.target.closest('[aria-controls]') ||
                             event.target.closest('[role="menu"]')

    if (!isInsideDropdown) {
      this.closeAllMenus()
    }
  }

  closeAllMenus() {
    this.element.querySelectorAll('[role="menu"]:not(.hidden)').forEach(menu => {
      menu.classList.add('hidden')
      const trigger = this.element.querySelector(`[aria-controls="${menu.id}"]`)
      trigger?.parentElement?.removeAttribute('data-open')
    })
  }
}
