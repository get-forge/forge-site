const inputSelector = '.js-search-input'
const itemSelector = '.js-search-item'
const contentSelector = '.js-search-content'
const originalContentSelector = '.js-original-content'
const searchResultsTargetSelector = '.js-search-results'
const searchResultsTextSelector = '.js-search-results-text'
const searchResultsContainerSelector = '.js-search-results-container'
const searchHotkeySelector = '.js-search-hotkey'
const searchResetSelector = '.js-search-reset'
function toggleResults(originalTarget, resultsTarget, searchHotkey, searchReset, searching) {
  originalTarget.classList.toggle('hidden', searching)
  resultsTarget.classList.toggle('hidden', !searching)
  searchHotkey.classList.toggle('hidden', searching)
  searchReset.classList.toggle('hidden', !searching)
}

function searchItems(resultsTarget, resultsText, items, query) {
  resultsTarget.replaceChildren()
  let results = 0
  const lowercaseQuery = query.toLowerCase()
  items.forEach(item => {
    const content = item.querySelector(contentSelector)
    if (content.textContent.toLowerCase().includes(lowercaseQuery)) {
      resultsTarget.appendChild(item.cloneNode(true))
      results += 1
    }
  })
  resultsText.innerText = `${results === 0 ? 'No' : results} result${results === 1 ? '' : 's'} for integrations matching “${query}”`
}

document.addEventListener('turbo:load', function() {
  const input = document.querySelector(inputSelector)
  if (!input) return

  const items = document.querySelectorAll(itemSelector)

  const originalTarget = document.querySelector(originalContentSelector)
  const resultsTarget = document.querySelector(searchResultsTargetSelector)
  const resultsContainer = document.querySelector(searchResultsContainerSelector)
  const resultsText = document.querySelector(searchResultsTextSelector)
  const searchHotkey = document.querySelector(searchHotkeySelector)
  const searchReset = document.querySelector(searchResetSelector)

  function search(query) {
    const searching = query !== ''
    toggleResults(originalTarget, resultsTarget, searchHotkey, searchReset, searching)

    if (!searching) return
    searchItems(resultsContainer, resultsText, items, query)
  }

  search(input.value)
  input.addEventListener('input', event => search(event.target.value))
  searchReset.addEventListener('click', () => {
    input.value = ''
    search(input.value)
  })
  document.addEventListener('keydown', event => {
    if (event.key === '/') {
      input.focus()
      event.preventDefault()
    }
  })
})
