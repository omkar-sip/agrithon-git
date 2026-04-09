type MobileNetModel = import('@tensorflow-models/mobilenet').MobileNet

let modelPromise: Promise<MobileNetModel> | null = null

export const loadMobileNet = (): Promise<MobileNetModel> => {
  if (!modelPromise) {
    modelPromise = (async () => {
      await import('@tensorflow/tfjs')
      const mobilenet = await import('@tensorflow-models/mobilenet')
      return mobilenet.load({ version: 2, alpha: 1.0 })
    })()
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

const NON_PLANT_HEAD = new RegExp(
  [
    '^(person|man|woman|boy|girl|baby|dog|cat|bird|horse|sheep|cow|elephant|bear|zebra|giraffe|',
    'car|bus|truck|motorcycle|bicycle|train|airplane|boat|',
    'laptop|keyboard|mouse|remote|cell phone|television|microwave|oven|toaster|sink|refrigerator|',
    'book|clock|vase|scissors|teddy bear|hair drier|toothbrush|',
    'chair|couch|bed|dining table|toilet|bathtub|',
    'computer|screen|monitor|desk|table lamp|wardrobe|cabinet)',
  ].join(''),
  'i',
)

const PLANT_HINT =
  /leaf|tree|flower|plant|fruit|vegetable|herb|grass|vine|vineyard|forest|wood|field|lawn|greenhouse|orchard|moss|broccoli|cabbage|cauliflower|zucchini|cucumber|pepper|corn|pumpkin|squash|acorn|strawberry|orange|lemon|apple|banana|pineapple|pomegranate|fig|mushroom|daisy|sunflower|rose|lotus|potato|tomato|seed|pod|stalk|bark|bamboo|palm|coconut|banana/i

export interface LeafCheckResult {
  ok: boolean
  topLabel: string
  topProbability: number
}

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

  const topFivePlantish = predictions.slice(0, 5).some(prediction => PLANT_HINT.test(prediction.className))
  if (!topFivePlantish) {
    return { ok: false, topLabel: top.className, topProbability: topProb }
  }

  return { ok: true, topLabel: top.className, topProbability: topProb }
}
