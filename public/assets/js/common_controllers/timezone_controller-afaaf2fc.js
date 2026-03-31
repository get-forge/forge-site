import { Controller } from '@hotwired/stimulus'
import { record_timezone_path } from 'routes'
import { timezones } from 'timezones'

export default class extends Controller {
  connect() {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneValue = timezones.find(tz => tz.js_value === userTimezone)?.value ?? userTimezone

    if (!window.cfg.browser_timezone || window.cfg.browser_timezone !== timezoneValue) {
      // XXX: window.onload + sleep is a hack to ensure that the timezone is sent to the backend after the page has loaded
      // to avoid race conditions with other asset requests that might override sessions data
      if (window.cfg.environment === 'development') {
        if (document.readyState === 'complete') {
          setTimeout(() => {
            this.sendTimezoneToBackend(timezoneValue)
          }, 2500)
        } else {
          window.onload = () => {
            setTimeout(() => {
              this.sendTimezoneToBackend(timezoneValue)
            }, 2500)
          }
        }
      } else {
        this.sendTimezoneToBackend(timezoneValue)
      }
    }
  }

  sendTimezoneToBackend(timezone) {
    fetch(record_timezone_path(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      },
      credentials: 'include',
      body: JSON.stringify({ timezone: timezone })
    })
  }
}
