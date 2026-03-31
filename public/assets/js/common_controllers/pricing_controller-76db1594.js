import { Controller } from '@hotwired/stimulus'

const activeClass = 'text-white'

export default class extends Controller {
  static targets = ['toggle', 'monthly', 'yearly']

  DEFAULT_REGION = 'germany'

  billingPeriod = 'yearly'

  connect() {
    this.monthlyPrices = this.element.querySelectorAll('.js-monthly-price')
    this.yearlyPrices = this.element.querySelectorAll('.js-yearly-price')

    this.pricesByRegion = [...this.element.querySelectorAll('.js-region-price')].reduce((acc, el) => {
      acc[el.dataset.region] ||= []
      acc[el.dataset.region].push(el)
      return acc
    }, {})

    this.abortController = new AbortController()
    document.addEventListener('pricing:region-select', (event) => {
      this.region = event.detail
      this.toggleRegion()
    }, { signal: this.abortController.signal })

    this.region = this.DEFAULT_REGION

    this.toggleTargets.forEach(toggle => {
      toggle.checked = this.billingPeriod === 'yearly'
    })
  }

  disconnect() {
    this.abortController.abort()
  }

  toggle() {
    this.billingPeriod = this.billingPeriod === 'yearly' ? 'monthly' : 'yearly'
    this.toggleTargets.forEach(toggle => {
      toggle.checked = this.billingPeriod === 'yearly'
    })

    this.monthlyTarget.classList.toggle(activeClass, this.billingPeriod === 'monthly')
    this.yearlyTarget.classList.toggle(activeClass, this.billingPeriod === 'yearly')

    this.monthlyPrices.forEach(this.billingPeriod === 'yearly' ? this.transitionOut : this.transitionIn)
    this.yearlyPrices.forEach(this.billingPeriod === 'yearly' ? this.transitionIn : this.transitionOut)
  }

  toggleRegion() {
    this.pricesByRegion[this.region].forEach((el) => {
      el.classList.remove('hidden')
    })
    Object.keys(this.pricesByRegion).forEach((region) => {
      if (region !== this.region) {
        this.pricesByRegion[region].forEach((el) => {
          el.classList.add('hidden')
        })
      }
    })
  }

  transitionIn(element) {
    element.style.height = 'auto'
    const height = getComputedStyle(element).height
    element.style.height = 0
    setTimeout(() => {
      element.style.height = height
    }, 20)
  }

  transitionOut(element) {
    const height = getComputedStyle(element).height
    element.style.height = height
    setTimeout(() => {
      element.style.height = 0
    }, 20)
  }
}
