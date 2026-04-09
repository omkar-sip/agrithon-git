import { env } from '../../config/env'
import type { PlantNetMatch } from '../../types/leafScanner'

const PLANTNET_MIN_SCORE = 0.25

const getPlantNetBaseUrl = (): string =>
  import.meta.env.DEV ? '/plantnet-api' : 'https://my-api.plantnet.org'

export async function identifyPlantWithPlantNet(file: File): Promise<PlantNetMatch> {
  const apiKey = env.plantnetApiKey
  if (!apiKey) {
    throw new Error('PlantNet API key is not configured. Add VITE_PLANTNET_API_KEY to your environment.')
  }

  const project = env.plantnetProject || 'all'
  const url = `${getPlantNetBaseUrl()}/v2/identify/${encodeURIComponent(project)}?api-key=${encodeURIComponent(apiKey)}`

  const body = new FormData()
  body.append('images', file)
  body.append('organs', 'leaf')

  const response = await fetch(url, {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    const text = await response.text().catch(() => '')
    throw new Error(`PlantNet error (${response.status}): ${text.slice(0, 200)}`)
  }

  const data = (await response.json()) as {
    results?: Array<{
      score: number
      species?: {
        scientificNameWithoutAuthor?: string
        commonNames?: string[]
      }
    }>
  }

  const best = data.results?.[0]
  const score = typeof best?.score === 'number' ? best.score : 0
  const scientific = best?.species?.scientificNameWithoutAuthor?.trim() || ''
  const common = best?.species?.commonNames?.[0]?.trim() || scientific

  if (!scientific || score < PLANTNET_MIN_SCORE) {
    throw new Error('Plant match confidence is too low. Retake a clearer photo of a single leaf and try again.')
  }

  return {
    scientificName: scientific,
    commonName: common || scientific,
    score,
  }
}
