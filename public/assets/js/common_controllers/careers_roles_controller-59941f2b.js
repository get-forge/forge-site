import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['roleContent', 'roleButton', 'salaryBase', 'salaryHardcore', 'roleTitle', 'hardcoreBadge', 'remoteLocation', 'onsiteLocation', 'mobileRole']
  static values = { activeRole: String, hardcoreMode: Boolean, remoteMode: Boolean }

  connect() {
    const fragmentRole = this.getRoleFromFragment()
    this.activeRoleValue = fragmentRole || this.data.get('active-role') || 'fullstack-engineer'
    this.hardcoreModeValue = false
    this.remoteModeValue = true

    if (fragmentRole) {
      this.showRole(this.activeRoleValue)
    }
  }

  getRoleFromFragment() {
    const fragment = window.location.hash.slice(1)
    if (fragment && this.hasRoleContent(fragment)) {
      return fragment
    }
    return null
  }

  hasRoleContent(roleSlug) {
    return this.roleContentTargets.some(content => content.dataset.role === roleSlug)
  }

  selectRole(event) {
    const roleSlug = event.target.tagName === 'SELECT' ? event.target.value : event.currentTarget.dataset.role
    this.showRole(roleSlug)

    window.history.replaceState(null, null, `#${roleSlug}`)
  }

  showRole(roleSlug) {
    this.roleContentTargets.forEach(content => {
      content.classList.add('hidden')
    })

    const selectedContent = this.roleContentTargets.find(content =>
      content.dataset.role === roleSlug
    )
    if (selectedContent) {
      selectedContent.classList.remove('hidden')
      const elementTop = selectedContent.offsetTop - 80

      window.scrollTo({
        top: elementTop,
        behavior: 'smooth'
      })
    }

    this.roleButtonTargets.forEach(button => {
      button.classList.remove('bg-[#11121C]')
      if (button.dataset.role === roleSlug) {
        button.classList.add('bg-[#11121C]')
      }
    })

    this.mobileRoleTargets.forEach(mobileRole => {
      mobileRole.classList.remove('border', 'border-[#7c87f7]/10')
      if (mobileRole.dataset.role === roleSlug) {
        mobileRole.classList.add('border', 'border-[#7c87f7]/10')
      }
    })

    this.activeRoleValue = roleSlug
  }

  updateActiveButton(activeButton) {
    this.roleButtonTargets.forEach(button => {
      button.classList.remove('bg-[#11121C]')
    })

    activeButton.classList.add('bg-[#11121C]')
  }

  toggleHardcore(event) {
    this.hardcoreModeValue = !this.hardcoreModeValue
    this.updateHardcoreDisplay()
  }

  toggleRemote(event) {
    this.remoteModeValue = !this.remoteModeValue
    this.updateLocationDisplay()
  }

  updateHardcoreDisplay() {
    this.toggleElements(this.salaryBaseTargets, !this.hardcoreModeValue)
    this.toggleElements(this.salaryHardcoreTargets, this.hardcoreModeValue)
    this.toggleElements(this.hardcoreBadgeTargets, this.hardcoreModeValue)

    this.roleTitleTargets.forEach(title => {
      const originalTitle = title.dataset.originalTitle || title.textContent
      if (!title.dataset.originalTitle) {
        title.dataset.originalTitle = originalTitle
      }
      title.textContent = this.hardcoreModeValue ? `Hardcore ${originalTitle}` : originalTitle
    })
  }

  updateLocationDisplay() {
    this.toggleElements(this.remoteLocationTargets, this.remoteModeValue)
    this.toggleElements(this.onsiteLocationTargets, !this.remoteModeValue)
  }

  toggleElements(elements, show) {
    elements.forEach(element => {
      element.classList.toggle('hidden', !show)
    })
  }
}
