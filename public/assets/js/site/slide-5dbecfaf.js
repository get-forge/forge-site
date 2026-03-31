let executed = false

function slide() {
  executed = true
  const container = document.querySelector('.js-slide')
  if (!container) return
  const items = [...container.children]
  let index = 0

  const interval = setInterval(() => {
    if (index === items.length - 1) {
      clearInterval(interval)
      return
    }

    const current = items[index]
    const next = items[index + 1]

    // move item up, skipping transition
    next.style.transition = 'none'
    next.style.transform = 'translateY(-10%)'
    const _ = next.offsetHeight
    next.style.transition = ''

    // slide down
    current.style.transform = 'translateY(10%)'
    current.style.opacity = 0
    next.style.opacity = 1
    next.style.transform = 'translateY(0)'

    index++
  }, 1500)
}

document.addEventListener('turbo:load', slide)

// in Safari, turbo:load fires before importmap scripts load
setTimeout(function() {
  if (!executed) slide()
}, 1000)
