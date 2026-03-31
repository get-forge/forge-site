// toggle elements with data-toggle='.selector'

document.addEventListener('turbo:load', function() {
  document.querySelectorAll('[data-toggle]').forEach(el => {
    el.addEventListener('click', function() {
      const selector = el.dataset.toggle
      document.querySelectorAll(selector).forEach(target => {
        target.classList.toggle('hidden')
      })
    })
  })
})
