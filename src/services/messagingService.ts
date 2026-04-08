import { apiAvailability, env } from '../config/env'
import { apiClient } from './api'

type SmsPayload = {
  sender: string
  route: string
  country: string
  sms: Array<{
    message: string
    to: string[]
  }>
}

export type SendMarketSmsParams = {
  phone: string
  commodity: string
  mandi: string
  pricePerQuintal: number
  trendPercent: number
  targetPrice?: number
}

const normalizeIndianPhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '')
  if (digits.length === 10) return `${env.msg91Country}${digits}`
  if (digits.length > 10) return digits
  return ''
}

const createMarketMessage = (params: SendMarketSmsParams): string => {
  const trendText =
    params.trendPercent > 0
      ? `up ${params.trendPercent}%`
      : params.trendPercent < 0
        ? `down ${Math.abs(params.trendPercent)}%`
        : 'stable'

  const threshold = params.targetPrice ? ` Alert target Rs${params.targetPrice}.` : ''

  return `${params.commodity} at ${params.mandi}: Rs${Math.round(
    params.pricePerQuintal
  )}/qtl, trend ${trendText}.${threshold} - Sarpanch AI`
}

export const hasSmsApi = () => apiAvailability.hasMsg91AuthKey

export const sendMarketPriceSms = async (params: SendMarketSmsParams): Promise<void> => {
  if (!hasSmsApi()) {
    throw new Error('MSG91 auth key is not configured.')
  }

  const normalizedPhone = normalizeIndianPhone(params.phone)
  if (!normalizedPhone) {
    throw new Error('Valid phone number is required to send SMS alerts.')
  }

  const payload: SmsPayload = {
    sender: env.msg91SenderId,
    route: env.msg91Route,
    country: env.msg91Country,
    sms: [
      {
        message: createMarketMessage(params),
        to: [normalizedPhone],
      },
    ],
  }

  await apiClient.post(env.msg91BaseUrl, payload, {
    headers: {
      authkey: env.msg91AuthKey,
      'Content-Type': 'application/json',
    },
  })
}

