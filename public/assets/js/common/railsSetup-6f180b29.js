import '@hotwired/turbo-rails'

// The default Turbo Accept header is text/vnd.turbo-stream.html, text/html, application/xhtml+xml,
// which makes Rails controllers respond with Content-Type: text/vnd.turbo-stream.html; charset=utf-8.
// This is not what we want on most buttons and forms; Turbo thinks the response contains a Turbo stream
// and will append the response to the current page. We want Rails to respond with text/html, so that
// Turbo will replace the body of the current page with the response body.
document.addEventListener('turbo:before-fetch-request', (event) => {
  if (event.target.tagName === 'TURBO-FRAME' || event.target.tagName === 'TURBO-STREAM') return
  if (event.target.dataset.turboStream === 'true') return
  event.detail.fetchOptions.headers.Accept = 'text/html, application/xhtml+xml'
})

// XXX: Turbo refuses to reload the very first page of the session (first history entry) when using the back button.
// This workaround forces a reload when going back to the first page of the session.
if (!window.firstPageLoadUrl) {
  window.firstPageLoadUrl = window.location.href
}

window.addEventListener('popstate', (event) => {
  if (window.replacingUrl) {
    // Avoid refreshing the page if we are replacing the current URL
    window.replacingUrl = false
    return
  }
  if (window.location.href === window.firstPageLoadUrl) {
    window.location.reload()
  }
})
