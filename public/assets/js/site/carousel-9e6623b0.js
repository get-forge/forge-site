function callback(entries) {
  entries.forEach(entry => {
    document.querySelector(`[href="#${entry.target.id}"] *`)?.classList.toggle('bg-[#363D4E]!', entry.isIntersecting)
  })
}

const observer = new IntersectionObserver(callback, { threshold: 1.0 })

document.addEventListener('turbo:load', function () {
  document.querySelectorAll('.js-carousel-item').forEach(el => {
    observer.observe(el)
  })
})
