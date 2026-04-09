export const GOVERNMENT_FARMER_PORTAL_URL = 'https://www.mkisan.gov.in/'

export const isExternalUrl = (value: string) => /^https?:\/\//i.test(value)

export const openExternalUrl = (url: string) => {
  if (typeof window === 'undefined') return
  window.location.assign(url)
}
