export function isMac() {
  // eslint-disable-next-line compat/compat
  return /mac|ipad|iphone/i.test(navigator.userAgentData?.platform ?? navigator.platform)
}

export function isIOS() {
  // eslint-disable-next-line compat/compat
  return /ipad|iphone/i.test(navigator.userAgentData?.platform ?? navigator.platform)
}
