const fixDimensions = (element) => {
  const rect = element.getBoundingClientRect()
  element.style.width = `${rect.width}px`
  element.style.height = `${rect.height}px`
}

const unfixDimensions = (element) => {
  element.style.width = ""
  element.style.height = ""
}

function initDataDisableWithSpinner() {
  document
    .querySelectorAll("[data-disable-with=spinner]")
    .forEach((element) => {
      element.setAttribute(
        "data-original-value",
        element.innerHTML || element.value
      )

      element.onclick = element.onsubmit = (e) => fixDimensions(e.target)

      // fancy spinner
      element.setAttribute(
        "data-turbo-submits-with",
        '<svg viewBox="0 0 24 24" class="spinner animate-spin" width="18" height="18"><g transform="translate(1 1)" fill-rule="nonzero" fill="none"><circle cx="11" cy="11" r="11"></circle><path d="M10.998 22a.846.846 0 0 1 0-1.692 9.308 9.308 0 0 0 0-18.616 9.286 9.286 0 0 0-7.205 3.416.846.846 0 1 1-1.31-1.072A10.978 10.978 0 0 1 10.998 0c6.075 0 11 4.925 11 11s-4.925 11-11 11z" fill="currentColor"></path></g></svg>'
      )
    })

  document
    .querySelectorAll("[data-turbo=false] [data-disable-with], [data-turbo=false] [data-turbo-submits-with], [data-turbo=false][data-disable-with], [data-turbo=false][data-turbo-submits-with]")
    .forEach((element) => {
      if (element.getAttribute('data-disable-with-no-turbo') === 'initialized') return

      element.setAttribute('data-disable-with-no-turbo', 'initialized')
      const handler = () => {
        window.disableElement(element)
        setTimeout(() => window.enableElement(element), 5000)
      }

      if (element.matches('form button[type="submit"], form input[type="submit"]')) {
        // On submit buttons inside forms trigger only on form submit event (to wait for form validation)
        element.closest('form').addEventListener('submit', handler)
      } else {
        element.addEventListener('click', handler);
      }
    })
}

initDataDisableWithSpinner();
document.addEventListener("turbo:load", initDataDisableWithSpinner)
document.addEventListener("turbo:frame-load", initDataDisableWithSpinner)

// Replacement for Rails.disableElement and Rails.enableElement
// Unlike Rails UJS, Turbo does not expose the functions it uses for data-turbo-submits-with
// https://github.com/hotwired/turbo-rails/blob/c57122c65d887df7ed0de35a5d3a7f97f73179da/app/assets/javascripts/turbo.js#L997-L1014
window.disableElement = function(submitter) {
  const submitsWith = submitter.dataset.turboSubmitsWith
  if (!submitter || !submitsWith) return

  if (submitter.matches("button")) {
    fixDimensions(submitter)
    if (!submitter.dataset.originalHtml) {
      submitter.dataset.originalHtml = submitter.innerHTML
    }
    submitter.innerHTML = submitsWith
  } else if (submitter.matches("input")) {
    fixDimensions(submitter)
    const input = submitter
    if (!submitter.dataset.originalHtml) {
      submitter.dataset.originalHtml = input.value
    }
    input.value = submitsWith
  }

  // needs to run after the event loop, otherwise the form is not submitted
  // and the native validations are not triggered
  setTimeout(() => { submitter.setAttribute('disabled', 'disabled') }, 1);
}

window.enableElement = function(submitter) {
  const originalSubmitHtml = submitter.dataset.originalHtml
  if (!submitter || !originalSubmitHtml) return

  if (submitter.matches("button")) {
    unfixDimensions(submitter)
    submitter.innerHTML = submitter.dataset.originalHtml
  } else if (submitter.matches("input")) {
    unfixDimensions(submitter)
    const input = submitter;
    input.value = submitter.dataset.originalHtml
  }

  submitter.removeAttribute('disabled');
}
