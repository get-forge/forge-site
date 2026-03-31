import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['scrollContainer', 'previousButton', 'nextButton', 'gradientPreviousButton', 'gradientNextButton']

  connect() {
    const itemWidths = JSON.parse(this.element.dataset.itemWidths)
    let sum = 0
    // eslint-disable-next-line no-return-assign
    this.scrollSnapPositions = [0, ...itemWidths.map(width => sum += width)]

    this.activeItemIndex = 0
    this.boundHandleScroll = this.handleScroll.bind(this)
    this.boundHandleScrollEnd = this.handleScrollEnd.bind(this)
    this.scrollContainerTarget.addEventListener('scroll', this.boundHandleScroll)

    this.updateNavigationButtons()

    this.isDragging = false
    this.hasMoved = false
    this.preventNextClick = false
    this.startX = 0
    this.dragDirection = null
    this.initMouseDrag()
  }

  disconnect() {
    this.scrollContainerTarget.removeEventListener('scroll', this.boundHandleScroll)
    this.cleanupMouseDrag()
  }

  handleScroll() {
    clearTimeout(this.scrollTimeout)
    this.scrollTimeout = setTimeout(this.boundHandleScrollEnd, 100)
  }

  handleScrollEnd() {
    this.activeItemIndex = this.getActiveItemIndex()
    this.updateNavigationButtons()
  }

  getActiveItemIndex() {
    for (let index = 1; index < this.scrollSnapPositions.length; index++) {
      if (this.scrollContainerTarget.scrollLeft <= this.scrollSnapPositions[index]) {
        return index - 1
      }
    }
    return this.scrollSnapPositions.length - 1
  }

  updateNavigationButtons() {
    const isAtStart = this.activeItemIndex === 0
    const isAtEnd = this.activeItemIndex === this.scrollSnapPositions.length - 3 // disable on second to last item

    this.previousButtonTarget.disabled = isAtStart
    this.nextButtonTarget.disabled = isAtEnd

    this.gradientPreviousButtonTarget.disabled = isAtStart
    this.gradientNextButtonTarget.disabled = isAtEnd
  }

  scrollToNext() {
    const targetIndex = Math.min(this.activeItemIndex + 1, this.scrollSnapPositions.length - 1)
    this.scrollContainerTarget.scrollTo({ left: this.scrollSnapPositions[targetIndex] })
  }

  scrollToPrevious() {
    const targetIndex = Math.max(this.activeItemIndex - 1, 0)
    this.scrollContainerTarget.scrollTo({ left: this.scrollSnapPositions[targetIndex] })
  }

  initMouseDrag() {
    this.boundMouseDown = this.handleMouseDown.bind(this)
    this.boundMouseMove = this.handleMouseMove.bind(this)
    this.boundMouseUp = this.handleMouseUp.bind(this)
    this.boundHandleClick = this.handleClick.bind(this)

    this.scrollContainerTarget.addEventListener('mousedown', this.boundMouseDown)

    this.gradientPreviousButtonTarget.addEventListener('mousedown', this.boundMouseDown)
    this.gradientNextButtonTarget.addEventListener('mousedown', this.boundMouseDown)

    document.addEventListener('mousemove', this.boundMouseMove)
    document.addEventListener('mouseup', this.boundMouseUp)
    this.scrollContainerTarget.addEventListener('click', this.boundHandleClick, true)
  }

  cleanupMouseDrag() {
    this.scrollContainerTarget.removeEventListener('mousedown', this.boundMouseDown)
    this.gradientPreviousButtonTarget.removeEventListener('mousedown', this.boundMouseDown)
    this.gradientNextButtonTarget.removeEventListener('mousedown', this.boundMouseDown)

    document.removeEventListener('mousemove', this.boundMouseMove)
    document.removeEventListener('mouseup', this.boundMouseUp)
    this.scrollContainerTarget.removeEventListener('click', this.boundHandleClick, true)
  }

  handleMouseDown(e) {
    // only react to left mouse button
    if (e.button !== 0) return

    e.preventDefault()

    this.isDragging = true
    this.hasMoved = false
    this.startX = e.pageX
  }

  handleMouseMove(e) {
    if (!this.isDragging) return

    e.preventDefault()
    const deltaX = e.pageX - this.startX

    if (Math.abs(deltaX) > 50) {
      this.hasMoved = true
      this.dragDirection = deltaX > 0 ? 'left' : 'right'
    }
  }

  handleMouseUp(e) {
    if (!this.isDragging) return
    this.preventNextClick = this.hasMoved

    if (this.hasMoved) {
      e.preventDefault()
      e.stopPropagation()

      if (this.dragDirection === 'left') {
        this.scrollToPrevious()
      } else {
        this.scrollToNext()
      }
    }

    this.isDragging = false
    this.hasMoved = false
    this.dragDirection = null
  }

  handleClick(e) {
    if (this.preventNextClick) {
      e.preventDefault()
      e.stopPropagation()
      this.preventNextClick = false
    }
  }
}
