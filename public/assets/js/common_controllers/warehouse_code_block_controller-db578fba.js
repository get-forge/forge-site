import { Controller } from '@hotwired/stimulus'

export default class extends Controller {
  static targets = ['tab', 'toggle', 'responseContent', 'responseToggle', 'runButton', 'copyButton', 'copyIcon', 'checkIcon', 'payloadDisplay']
  static values = {
    blockId: Number,
    curlCommand: String
  }

  async connect() {
    this.activeTab = 'curl'
    this.applyClasses()

    if (this.blockIdValue === 1) {
      await this.loadBrowserInfo()
    }
  }

  async gatherBrowserInfo() {
    const info = {
      dt: new Date().toISOString(),
      browser: {},
      system: {},
      screen: {},
      hardware: {},
      network: {},
      timezone: {},
      language: {},
      features: {}
    }

    const ua = navigator.userAgent

    const getBrowser = () => {
      const browsers = {
        Chrome: /Chrome\/(\S+)/,
        Firefox: /Firefox\/(\S+)/,
        Safari: /Version\/(\S+).*Safari/,
        Edge: /Edg\/(\S+)/,
        Opera: /OPR\/(\S+)/
      }

      for (const [name, regex] of Object.entries(browsers)) {
        const match = ua.match(regex)
        if (match) return { name, version: match[1] }
      }
      return { name: 'Unknown', version: 'Unknown' }
    }

    const getOS = () => {
      const systems = [
        { name: 'Windows 11', pattern: /Windows NT 10\.0.*Windows NT 11\.0/ },
        { name: 'Windows 10', pattern: /Windows NT 10\.0/ },
        { name: 'macOS', pattern: /Mac OS X (\d+[._]\d+)/ },
        { name: 'iOS', pattern: /iPhone OS (\d+[._]\d+)/ },
        { name: 'Android', pattern: /Android (\d+\.?\d*)/ },
        { name: 'Linux', pattern: /Linux/ }
      ]

      for (const system of systems) {
        if (system.pattern.test(ua)) {
          const match = ua.match(system.pattern)
          return {
            name: system.name,
            version: match && match[1] ? match[1].replace(/_/g, '.') : 'Unknown'
          }
        }
      }
      return { name: 'Unknown', version: 'Unknown' }
    }

    const browser = getBrowser()
    info.browser = {
      name: browser.name,
      version: browser.version,
      userAgent: ua,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    }

    const os = getOS()
    info.system = {
      os: os.name,
      osVersion: os.version,
      is64Bit: ua.includes('x64') || ua.includes('x86_64'),
      isMobile: /Mobile|Android|iPhone|iPad/i.test(ua)
    }

    info.screen = {
      width: window.screen.width,
      height: window.screen.height,
      colorDepth: window.screen.colorDepth,
      pixelRatio: window.devicePixelRatio || 1,
      touchPoints: navigator.maxTouchPoints || 0
    }

    info.hardware = {
      cores: navigator.hardwareConcurrency || 'Unknown',
    }

    if ('connection' in navigator) {
      const conn = navigator.connection
      info.network = {
        effectiveType: conn.effectiveType || 'Unknown',
        downlink: conn.downlink || 'Unknown',
        rtt: conn.rtt || 'Unknown',
        saveData: conn.saveData || false
      }
    }

    const date = new Date()
    info.timezone = {
      offset: date.getTimezoneOffset(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }

    info.language = {
      primary: navigator.language,
      all: navigator.languages || [navigator.language]
    }

    info.features = {
      webGL: (() => {
        try {
          const canvas = document.createElement('canvas')
          return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        } catch (e) {
          return false
        }
      })(),
      serviceWorker: 'serviceWorker' in navigator,
      webAssembly: typeof WebAssembly === 'object'
    }

    const getGPUInfo = () => {
      try {
        const canvas = document.createElement('canvas')
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
        if (!gl) return 'Not supported'

        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        if (debugInfo) {
          return {
            vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
            renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          }
        }
        return {
          vendor: gl.getParameter(gl.VENDOR),
          renderer: gl.getParameter(gl.RENDERER)
        }
      } catch (e) {
        return 'Unavailable'
      }
    }
    info.hardware.gpu = getGPUInfo()

    return info
  }

  async loadBrowserInfo() {
    if (this.hasRunButtonTarget) {
      this.runButtonTarget.disabled = true
    }

    try {
      const browserInfo = await this.gatherBrowserInfo()

      const config = this.blockConfig
      config.body = JSON.stringify([browserInfo])

      this.updateCurlDisplay(browserInfo)

      if (this.hasRunButtonTarget) {
        this.runButtonTarget.disabled = false
      }
    } catch (error) {
      console.error('Failed to gather browser info:', error)
      if (this.hasRunButtonTarget) {
        this.runButtonTarget.disabled = false
      }
    }
  }

  updateCurlDisplay(browserInfo) {
    if (!this.hasPayloadDisplayTarget) return

    const compactJson = JSON.stringify(browserInfo)
      .replace(/":/g, '": ')
      .replace(/,"/g, ', "')
    const endpoint = ''
    const token = 'JiATyrxDfaAR9cP1erYDytMR'

    const jsonArray = `[${compactJson}]`
    const curlCommand = `curl -X POST ${endpoint} \\\n-H "Authorization: Bearer ${token}" \\\n-H "Content-Type: application/json" \\\n-d '${jsonArray}'`

    this.curlCommandValue = curlCommand

    const browserFieldPattern = /"browser": /
    const match = compactJson.match(browserFieldPattern)

    if (match) {
      const breakPoint = compactJson.indexOf('"browser": ') + '"browser": '.length
      const firstPart = `[${compactJson.substring(0, breakPoint)}`
      const secondPart = compactJson.substring(breakPoint)

      this.payloadDisplayTarget.innerHTML = `<span class="text-brand-primary-80 ml-[54px]">-d</span> '${firstPart}<br>${secondPart}]'`
    } else {
      this.payloadDisplayTarget.innerHTML = `<span class="text-brand-primary-80 ml-[54px]">-d</span> '${jsonArray}'`
    }
  }

  get blockConfig() {
    const configs = {
      1: {
        endpoint: '',
        method: 'POST',
        headers: {
          'Authorization': 'Bearer JiATyrxDfaAR9cP1erYDytMR',
          'Content-Type': 'application/json'
        }
      },
      2: {
        endpoint: '',
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': 'Basic ' + btoa('uBSo9t0g3eqiITS6hN8QLIuIOpkYLo0hN:jJzkwCCipA2LIwf6h1yo3IzpK36jjEQKp9swg86IxOgYbnXLmziJLmVtXSfnNwCC')
        },
        body: `SELECT
         cpu_cores,
         countMerge(events_count) AS visitors,
         bar(visitors, 0, max(countMerge(events_count)) OVER (), 50) AS histogram
         FROM remote(t466713_homepage_timeseries)
         WHERE cpu_cores IS NOT NULL
         GROUP BY cpu_cores
         ORDER BY visitors DESC
         FORMAT Pretty`
      },
      3: {
        endpoint: '',
        method: 'GET',
        headers: {}
      }
    }

    return configs[this.blockIdValue] || {}
  }

  switchTab(event) {
    this.activeTab = event.currentTarget.dataset.tab
    this.applyClasses()
  }

  async copy() {
    let textToCopy = ''

    if (this.activeTab === 'curl') {
      textToCopy = this.curlCommandValue
    } else if (this.activeTab === 'response') {
      if (this.hasResponseContentTarget) {
        textToCopy = this.responseContentTarget.textContent || this.responseContentTarget.innerText
      }
    }

    if (!textToCopy) return

    try {
      await navigator.clipboard.writeText(textToCopy)

      if (this.hasCopyIconTarget && this.hasCheckIconTarget) {
        this.copyIconTarget.classList.add('hidden')
        this.checkIconTarget.classList.remove('hidden')

        setTimeout(() => {
          this.copyIconTarget.classList.remove('hidden')
          this.checkIconTarget.classList.add('hidden')
        }, 1500)
      }
    } catch (error) {
      // Failed to copy to clipboard
    }
  }

  async run() {
    if (this.hasRunButtonTarget) {
      this.runButtonTarget.disabled = true
    }

    try {
      const config = this.blockConfig

      if (this.blockIdValue === 1) {
        const browserInfo = await this.gatherBrowserInfo()
        config.body = JSON.stringify([browserInfo])
        this.updateCurlDisplay(browserInfo)

        const fetchOptions = {
          method: config.method || 'GET',
          headers: config.headers || {}
        }

        if (config.body) {
          fetchOptions.body = config.body
        }

        await fetch(config.endpoint, fetchOptions)

        const mockResponse = `HTTP/1.1 202 Accepted`

        if (this.hasResponseContentTarget) {
          this.responseContentTarget.innerHTML = `<pre>${this.escapeHtml(mockResponse)}</pre>`
        }
        if (this.hasResponseToggleTarget) {
          this.responseToggleTarget.classList.remove('hidden')
        }
        this.activeTab = 'response'
        this.applyClasses()

        if (this.hasRunButtonTarget) {
          this.runButtonTarget.disabled = false
        }
        return
      }

      const fetchOptions = {
        method: config.method || 'GET',
        headers: config.headers || {}
      }

      if (config.body) {
        fetchOptions.body = config.body
      }

      const response = await fetch(config.endpoint, fetchOptions)

      const data = await response.text()

      let formattedData = data
      try {
        const parsed = JSON.parse(data)
        formattedData = JSON.stringify(parsed, null, 2)
      } catch (error) {
        // Not JSON, use raw text
      }

      if (this.hasResponseContentTarget) {
        this.responseContentTarget.innerHTML = `<pre>${this.escapeHtml(formattedData)}</pre>`
      }
      if (this.hasResponseToggleTarget) {
        this.responseToggleTarget.classList.remove('hidden')
      }
      this.activeTab = 'response'
      this.applyClasses()
    } catch (error) {
      if (this.hasResponseContentTarget) {
        this.responseContentTarget.innerHTML = `<pre>Error: ${this.escapeHtml(error.message)}</pre>`
      }

      if (this.hasResponseToggleTarget) {
        this.responseToggleTarget.classList.remove('hidden')
      }
      this.activeTab = 'response'
      this.applyClasses()
    } finally {
      if (this.hasRunButtonTarget) {
        this.runButtonTarget.disabled = false
      }
    }
  }

  applyClasses() {
    for (const toggle of this.toggleTargets) {
      const isActive = toggle.dataset.tab === this.activeTab
      toggle.dataset.active.split(' ').forEach((className) => {
        toggle.classList.toggle(className, isActive)
      })
    }

    for (const tab of this.tabTargets) {
      tab.classList.toggle('hidden', tab.dataset.tab !== this.activeTab)
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
}
