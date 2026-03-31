import "lazysizes"

document.addEventListener('lazybeforeunveil', function(e) {
  const bg = e.target.getAttribute('data-bg');
  if (bg) {
    e.target.style.backgroundImage = `url(${bg})`
  }
})
