document.addEventListener('turbo:load', () => {
  document.querySelectorAll('.js-collapsible').forEach(el => {
    el.classList.remove('js-loading')

    const content = el.querySelector('.js-collapsible-content')
    if (!content) return

    const chevron = el.querySelector('.js-collapsible-chevron')
    let collapsed = false

    content.classList.add(...['transition-[height]', 'ease-out', 'duration-100'])
    content.addEventListener('transitionend', function(e) {
      if (!collapsed) {
        e.target.style.height = 'auto'
        e.target.style.overflow = ''
      }
    })

    function toggle() {
      chevron?.classList.toggle('-rotate-90')
      collapsed = !collapsed
      el.classList.toggle('js-collapsed', collapsed)
      if (!collapsed) {
        content.style.height = 'auto'
        const height = getComputedStyle(content).height
        content.style.height = 0
        setTimeout(() => {
          content.style.height = height
        }, 20)
      } else {
        const height = getComputedStyle(content).height
        content.style.height = height
        content.style.overflow = 'hidden'
        setTimeout(() => {
          content.style.height = 0
        }, 20)
      }
    }

    if (content.dataset.defaultCollapsed !== undefined) {
      toggle()
    }
    el.addEventListener('click', toggle)
  })
})
