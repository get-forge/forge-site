const getActiveClasses = ringColor => [ringColor, 'ring-2', 'ring-offset-2', 'ring-offset-[#0B0C14]']
const desktopAnchorPadding = 6
const mobileAnchorPadding = 20
const screenshotPadding = 40

function _createScreenshotAnchors(container, firstScreenshot, activeClasses, anchorPadding) {
  const firstScreenshotImage = firstScreenshot.firstElementChild
  const screenshotCountNeeded = Math.ceil(firstScreenshotImage.offsetHeight / firstScreenshot.offsetHeight)

  for (let i = 1; i < screenshotCountNeeded; i++) {
    const newScreenshot = firstScreenshot.cloneNode(true)

    let offset
    if (i === screenshotCountNeeded - 1) {
      // move last anchor image to bottom
      offset = firstScreenshotImage.offsetHeight - firstScreenshot.offsetHeight + 2 * anchorPadding
    } else {
      offset = i * firstScreenshot.offsetHeight + anchorPadding
    }
    newScreenshot.firstElementChild.style.top = -offset + 'px'
    newScreenshot.style.opacity = 0

    container.appendChild(newScreenshot)
    setTimeout(() => {
      newScreenshot.style.opacity = 1
    })
  }

  document.querySelector('.js-default-active')?.classList.add(...activeClasses)
}

function _addAnchorEventListeners(screenshotElement, activeClasses, anchorPadding) {
  const anchors = document.querySelectorAll('.js-gallery-anchor')

  anchors.forEach(element => {
    element.addEventListener('click', event => {
      anchors.forEach(anchor => {
        anchor.classList.remove(...activeClasses)
      })
      element.classList.add(...activeClasses)
      const anchorPxOffset = Number(element.firstElementChild.style.top.replace('px', ''))
      const anchorPercentageOffset = -anchorPxOffset / element.offsetHeight
      const screenshotOffset = anchorPercentageOffset * screenshotElement.offsetHeight - (screenshotPadding - anchorPadding)
      screenshotElement.scrollTop = screenshotOffset
    })
  })
}

function createGallery(anchorsContainer, screenshotElement, anchor, activeClasses, anchorPadding) {
  const firstScreenshotImage = anchor.firstElementChild

  if (firstScreenshotImage.complete) {
    _createScreenshotAnchors(anchorsContainer, anchor, activeClasses, anchorPadding)
    if (screenshotElement) {
      _addAnchorEventListeners(screenshotElement, activeClasses, anchorPadding)
    }
    return
  }

  firstScreenshotImage.addEventListener('load', () => {
    _createScreenshotAnchors(anchorsContainer, anchor, activeClasses, anchorPadding)
    if (screenshotElement) {
      _addAnchorEventListeners(screenshotElement, activeClasses, anchorPadding)
    }
  })
}

document.addEventListener('turbo:load', function() {
  const screenshotElement = document.querySelector('.js-gallery-screenshot')
  if (!screenshotElement) return

  const firstAnchor = document.querySelector('.js-gallery-anchor')
  const anchorsContainer = firstAnchor.parentNode
  const mobileScreenshotElement = document.querySelector('.js-gallery-mobile')
  const activeClasses = getActiveClasses(screenshotElement.dataset.ring)

  createGallery(anchorsContainer, screenshotElement, firstAnchor, activeClasses, desktopAnchorPadding)
  createGallery(mobileScreenshotElement.parentNode, null, mobileScreenshotElement, activeClasses, mobileAnchorPadding)
})
