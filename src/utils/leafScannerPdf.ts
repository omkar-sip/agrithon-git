import { jsPDF } from 'jspdf'
import type { LeafDiseaseAnalysis } from '../types/leafScanner'

const CARD_BODY_LINE_HEIGHT = 5
const CARD_SIDE_PADDING = 8
const CARD_TITLE_TOP = 7
const CARD_BODY_TOP = 14
const CARD_BOTTOM_PADDING = 6
const TREATMENT_BODY_LINE_HEIGHT = 4.8
const TREATMENT_SIDE_PADDING = 8
const TREATMENT_BODY_TOP = 28
const TREATMENT_BOTTOM_PADDING = 7

const COLORS = {
  brand: [46, 125, 90] as const,
  brandSoft: [232, 245, 236] as const,
  accent: [245, 124, 0] as const,
  accentSoft: [255, 243, 224] as const,
  danger: [198, 40, 40] as const,
  dangerSoft: [252, 235, 235] as const,
  text: [28, 42, 34] as const,
  muted: [92, 108, 99] as const,
  border: [214, 227, 219] as const,
  white: [255, 255, 255] as const,
}

const getPlantNetConfidenceLabel = (score: number): string => {
  if (score >= 0.6) return 'High'
  if (score >= 0.25) return 'Moderate'
  return 'Low'
}

const getSeverityStyles = (
  severity: LeafDiseaseAnalysis['severity'],
): { fill: readonly [number, number, number]; text: readonly [number, number, number] } => {
  if (severity === 'High') {
    return { fill: COLORS.dangerSoft, text: COLORS.danger }
  }
  if (severity === 'Medium') {
    return { fill: COLORS.accentSoft, text: COLORS.accent }
  }
  return { fill: COLORS.brandSoft, text: COLORS.brand }
}

const getSeverityGuidance = (severity: LeafDiseaseAnalysis['severity']): string => {
  if (severity === 'High') {
    return 'Disease spread appears serious. Start treatment quickly and contact a local agriculture expert if the issue is spreading across the field.'
  }
  if (severity === 'Medium') {
    return 'The crop condition needs attention soon. Early treatment and field hygiene can usually prevent further spread.'
  }
  return 'The issue looks manageable at this stage. Start treatment now and keep monitoring new leaves for changes.'
}

const getCropProtectionNote = (analysis: LeafDiseaseAnalysis): string => {
  if (!analysis.treatments.length) {
    return 'No treatment suggestions were generated. Retake a clearer photo or consult a nearby agri officer for confirmation.'
  }

  return `Start with ${analysis.treatments[0].name.toLowerCase()} and continue field monitoring for the next 7 to 10 days.`
}

export function downloadLeafScanPdf(params: {
  imageDataUrl: string
  analysis: LeafDiseaseAnalysis
  plantLabel: string
  plantScore: number
}): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentW = pageW - margin * 2
  const fmt = params.imageDataUrl.toLowerCase().includes('image/png') ? 'PNG' : 'JPEG'
  const plantConfidencePercent = (params.plantScore * 100).toFixed(1)
  const plantConfidenceLabel = getPlantNetConfidenceLabel(params.plantScore)
  const severityStyles = getSeverityStyles(params.analysis.severity)
  let y = 0

  const setTextColor = (color: readonly [number, number, number]): void => {
    doc.setTextColor(color[0], color[1], color[2])
  }

  const setFillColor = (color: readonly [number, number, number]): void => {
    doc.setFillColor(color[0], color[1], color[2])
  }

  const setDrawColor = (color: readonly [number, number, number]): void => {
    doc.setDrawColor(color[0], color[1], color[2])
  }

  const drawPageHeader = (): void => {
    setFillColor(COLORS.brand)
    doc.rect(0, 0, pageW, 34, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    setTextColor(COLORS.white)
    doc.text('Crop Disease Report', margin, 14)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Farmer-friendly field summary and treatment guidance', margin, 21)
    doc.text(`Generated on ${new Date().toLocaleString()}`, margin, 27)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('Sarpanch AI', pageW - margin, 14, { align: 'right' })

    y = 42
  }

  const addPage = (): void => {
    doc.addPage()
    drawPageHeader()
  }

  const ensureSpace = (requiredHeight: number): void => {
    if (y + requiredHeight > pageH - 16) {
      addPage()
    }
  }

  const drawSectionTitle = (title: string, subtitle?: string): void => {
    ensureSpace(subtitle ? 16 : 11)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    setTextColor(COLORS.text)
    doc.text(title, margin, y)
    y += 6

    if (subtitle) {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      setTextColor(COLORS.muted)
      const lines = doc.splitTextToSize(subtitle, contentW)
      doc.text(lines, margin, y)
      y += lines.length * 4.2 + 2
    }
  }

  const drawInfoCard = (x: number, top: number, width: number, height: number, title: string, value: string): void => {
    setDrawColor(COLORS.border)
    setFillColor(COLORS.white)
    doc.roundedRect(x, top, width, height, 4, 4, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    setTextColor(COLORS.muted)
    doc.text(title.toUpperCase(), x + CARD_SIDE_PADDING, top + 7)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    setTextColor(COLORS.text)
    const valueLines = doc.splitTextToSize(value, width - CARD_SIDE_PADDING * 2)
    doc.text(valueLines, x + CARD_SIDE_PADDING, top + 14)
  }

  const drawParagraphCard = (
    title: string,
    body: string,
    options?: {
      fill?: readonly [number, number, number]
      stroke?: readonly [number, number, number]
      titleColor?: readonly [number, number, number]
      bodyColor?: readonly [number, number, number]
    },
  ): void => {
    const lines = doc.splitTextToSize(body, contentW - CARD_SIDE_PADDING * 2)
    const bodyHeight = Math.max(lines.length, 1) * CARD_BODY_LINE_HEIGHT
    const boxHeight = CARD_BODY_TOP + bodyHeight + CARD_BOTTOM_PADDING
    ensureSpace(boxHeight + 2)

    setDrawColor(options?.stroke ?? COLORS.border)
    setFillColor(options?.fill ?? COLORS.white)
    doc.roundedRect(margin, y, contentW, boxHeight, 5, 5, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    setTextColor(options?.titleColor ?? COLORS.text)
    doc.text(title, margin + CARD_SIDE_PADDING, y + CARD_TITLE_TOP)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    setTextColor(options?.bodyColor ?? COLORS.text)
    doc.text(lines, margin + CARD_SIDE_PADDING, y + CARD_BODY_TOP)

    y += boxHeight + 6
  }

  drawPageHeader()

  try {
    drawSectionTitle('Quick summary', 'This report helps the farmer understand what was detected, how urgent it looks, and what action to take first.')

    const cardGap = 4
    const cardW = (contentW - cardGap * 2) / 3
    const cardH = 24
    drawInfoCard(margin, y, cardW, cardH, 'Crop', params.analysis.cropName)
    drawInfoCard(margin + cardW + cardGap, y, cardW, cardH, 'Issue found', params.analysis.diseaseName)
    drawInfoCard(margin + (cardW + cardGap) * 2, y, cardW, cardH, 'Severity', params.analysis.severity)
    y += cardH + 6

    const summaryText = `${getSeverityGuidance(params.analysis.severity)} ${getCropProtectionNote(params.analysis)}`
    drawParagraphCard('What this means', summaryText, {
      fill: severityStyles.fill,
      stroke: severityStyles.fill,
      titleColor: severityStyles.text,
    })

    drawSectionTitle('Leaf photo and plant check')
    const imgW = contentW
    const maxImgH = 78
    ensureSpace(maxImgH + 18)
    doc.addImage(params.imageDataUrl, fmt, margin, y, imgW, maxImgH)
    y += maxImgH + 6
  } catch {
    drawParagraphCard('Leaf photo', 'Leaf image could not be embedded in this PDF. The diagnosis details below are still available.', {
      fill: COLORS.accentSoft,
      stroke: COLORS.accentSoft,
      titleColor: COLORS.accent,
    })
  }

  drawParagraphCard(
    'Plant identification',
    `Plant match: ${params.plantLabel}\nConfidence: ${plantConfidenceLabel} (${plantConfidencePercent}%)`,
    {
      fill: COLORS.brandSoft,
      stroke: COLORS.brandSoft,
      titleColor: COLORS.brand,
    },
  )

  if (plantConfidenceLabel === 'Low') {
    drawParagraphCard(
      'Important note',
      'Plant identification confidence is weak. Treat the plant name as a hint only and retake a photo of one clear leaf if you need stronger identification.',
      {
        fill: COLORS.accentSoft,
        stroke: COLORS.accentSoft,
        titleColor: COLORS.accent,
      },
    )
  }

  if (params.analysis.treatments.length > 0) {
    const firstTreatment = params.analysis.treatments[0]
    drawParagraphCard(
      'Priority action',
      `Start with ${firstTreatment.name}. ${firstTreatment.usage}`,
      {
        fill: COLORS.brandSoft,
        stroke: COLORS.brandSoft,
        titleColor: COLORS.brand,
      },
    )
  }

  drawSectionTitle(
    'Recommended treatments',
    'Follow these steps in order and monitor the crop regularly. Costs are estimates and may vary by local market.',
  )

  params.analysis.treatments.forEach((t, index) => {
    const usageLines = doc.splitTextToSize(t.usage, contentW - TREATMENT_SIDE_PADDING * 2)
    const usageHeight = Math.max(usageLines.length, 1) * TREATMENT_BODY_LINE_HEIGHT
    const cardHeight = TREATMENT_BODY_TOP + usageHeight + TREATMENT_BOTTOM_PADDING
    ensureSpace(cardHeight + 4)

    setDrawColor(COLORS.border)
    setFillColor(COLORS.white)
    doc.roundedRect(margin, y, contentW, cardHeight, 5, 5, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    setTextColor(COLORS.text)
    doc.text(`${index + 1}. ${t.name}`, margin + TREATMENT_SIDE_PADDING, y + 8)

    const typeLabel = t.type.toUpperCase()
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    const typeWidth = Math.max(doc.getTextWidth(typeLabel) + 8, 24)
    setFillColor(COLORS.brandSoft)
    setDrawColor(COLORS.brandSoft)
    doc.roundedRect(pageW - margin - typeWidth - 6, y + 4, typeWidth, 8, 4, 4, 'FD')
    setTextColor(COLORS.brand)
    doc.text(typeLabel, pageW - margin - typeWidth / 2 - 6, y + 9, { align: 'center' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    setTextColor(COLORS.muted)
    doc.text(`Estimated cost: INR ${t.averageCostInr}`, margin + TREATMENT_SIDE_PADDING, y + 15)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    setTextColor(COLORS.text)
    doc.text('How to use', margin + TREATMENT_SIDE_PADDING, y + 22)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    setTextColor(COLORS.text)
    doc.text(usageLines, margin + TREATMENT_SIDE_PADDING, y + TREATMENT_BODY_TOP)

    y += cardHeight + 5
  })

  drawParagraphCard(
    'Farmer note',
    'This AI report is for guidance only. If the disease spreads quickly, affects many plants, or returns after treatment, contact your nearest KVK or agriculture officer.',
    {
      fill: COLORS.brandSoft,
      stroke: COLORS.brandSoft,
      titleColor: COLORS.brand,
    },
  )

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  setTextColor(COLORS.muted)
  doc.text('Generated by Sarpanch AI leaf scanner', margin, pageH - 8)

  doc.save(`crop-disease-report-${Date.now()}.pdf`)
}
