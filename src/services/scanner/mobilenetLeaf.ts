import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'

let modelPromise: Promise<mobilenet.MobileNet> | null = null

export const loadMobileNet = (): Promise<mobilenet.MobileNet> => {
  if (!modelPromise) {
    modelPromise = mobilenet.load({ version: 2, alpha: 1.0 })
  }
  return modelPromise
}

const loadImageElement = (dataUrl: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not load image'))
    img.src = dataUrl
  })

/** Strong non-plant cues in ImageNet MobileNet top-1 (reject if very confident). */
const NON_PLANT_HEAD = new RegExp(
  [
    '^(person|man|woman|boy|girl|baby|dog|cat|bird|horse|sheep|cow|elephant|bear|zebra|giraffe|',
    'car|bus|truck|motorcycle|bicycle|train|airplane|boat|',
    'laptop|keyboard|mouse|remote|cell phone|television|microwave|oven|toaster|sink|refrigerator|',
    'book|clock|vase|scissors|teddy bear|hair drier|toothbrush|',
    'chair|couch|bed|dining table|toilet|bathtub|',
    'computer|screen|monitor|desk|table lamp|wardrobe|cabinet)',
  ].join(''),
  'i'
)

/** Hints that the scene/object is plant or crop related (ImageNet label text). */
const PLANT_HINT =
  /leaf|tree|flower|plant|fruit|vegetable|herb|grass|vine|vineyard|forest|wood|field|lawn|greenhouse|orchard|moss|broccoli|cabbage|cauliflower|zucchini|cucumber|pepper|corn|pumpkin|squash|acorn|strawberry|orange|lemon|apple|banana|pineapple|pomegranate|fig|mushroom|daisy|sunflower|rose|lotus|potato|tomato|seed|pod|stalk|bark|bamboo|palm|coconut|banana/i

export interface LeafCheckResult {
  ok: boolean
  topLabel: string
  topProbability: number
}

/**
 * Heuristic leaf/plant-likeness using MobileNet (ImageNet).
 * Not a dedicated leaf model — used as a fast pre-check before PlantNet.
 */
export async function validateLeafLikeImage(dataUrl: string): Promise<LeafCheckResult> {
  const model = await loadMobileNet()
  const image = await loadImageElement(dataUrl)
  const predictions = await model.classify(image)

  if (!predictions.length) {
    return { ok: false, topLabel: '', topProbability: 0 }
  }

  const top = predictions[0]
  const topName = top.className.split(',')[0].trim()
  const topProb = top.probability

  if (topProb > 0.45 && NON_PLANT_HEAD.test(topName)) {
    return { ok: false, topLabel: top.className, topProbability: topProb }
  }

  const topFivePlantish = predictions.slice(0, 5).some(p => PLANT_HINT.test(p.className))
  if (!topFivePlantish) {
    return { ok: false, topLabel: top.className, topProbability: topProb }
  }

  return { ok: true, topLabel: top.className, topProbability: topProb }
}
