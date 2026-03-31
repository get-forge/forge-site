import AOS from 'aos'

function initAOS() {
  AOS.init({
    duration: Number(document.body.dataset.aosDuration || 1000),
    once: true,
  })
}

function refreshAOS() {
  AOS.refresh()
}

initAOS()
let firstLoad = true

document.addEventListener('turbo:load', function () {
  // prevent double init on first load
  if (firstLoad) {
    firstLoad = false
    return
  }

  // animate again when returning to a page
  document
    .querySelectorAll('.aos-init, .aos-animate')
    .forEach((el) => {
      el.classList.remove('aos-init', 'aos-animate')
    })

  initAOS()

  // animate lazy-loaded images
  document.querySelectorAll('img').forEach(img =>
    img.addEventListener('load', refreshAOS)
  )
})
