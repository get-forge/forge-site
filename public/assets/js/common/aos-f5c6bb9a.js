// `vendor/aos.js` is UMD with no ESM `export`. Load it in index.html (classic script) so
// AOS is on the global, then this module can run without a failing `import` from the importmap.
/* global AOS */
const AOS =
  typeof globalThis.AOS === 'object' && globalThis.AOS && typeof globalThis.AOS.init === 'function'
    ? globalThis.AOS
    : null

if (!AOS) {
  throw new Error('AOS: load /assets/js/vendor/aos.js (classic) before homepage-imports')
}

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
