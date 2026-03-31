window.toggleModal = (id, event) => {
  event?.preventDefault()

  const toggle = (element) => {
    document.body.classList.toggle('stop-scrolling')
    element.classList.toggle('hidden')
  }

  const setupModal = (element) => {
    if (element.toggle) return; // Modal was already setup, do not add more event listeners
    element.toggle = () => { toggle(element) }

    element.addEventListener('click', (e) => {
      e.stopPropagation()
      toggle(element)
    })

    element.querySelectorAll('[data-target="content"]').forEach((elem) => {
      elem.addEventListener('click', (e) => {
        e.stopPropagation()
      })
    })

    element.querySelectorAll('[data-click="toggle"]').forEach((elem) => {
      elem.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(element)
      })
    })

    // Attach event to document in order to receive events even if no element is focused
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape' && !element.classList.contains('hidden')) {
        e.preventDefault()
        e.stopPropagation()
        toggle(element)
      }
    })
  }

  document.addEventListener('turbo:load', function() {
    const element = document.getElementById(id);
    setupModal(element)
  })

  const element = document.getElementById(id);
  setupModal(element)
  toggle(element)
}
