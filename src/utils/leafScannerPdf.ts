import { jsPDF } from 'jspdf'
import type { LeafDiseaseAnalysis } from '../types/leafScanner'

const getPlantNetConfidenceLabel = (score: number): string => {
  if (score >= 0.6) return 'High'
  if (score >= 0.25) return 'Moderate'
  return 'Low'
}

export function downloadLeafScanPdf(params: {
  imageDataUrl: string
  analysis: LeafDiseaseAnalysis
  plantLabel: string
  plantScore: number
}): void {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = 18

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('Crop Disease Analysis Report', pageW / 2, y, { align: 'center' })
  y += 12

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text(`Scan date: ${new Date().toLocaleString()}`, 14, y)
  y += 9

  const imgW = pageW - 28
  const maxImgH = 85
  const fmt = params.imageDataUrl.toLowerCase().includes('image/png') ? 'PNG' : 'JPEG'

  try {
    doc.addImage(params.imageDataUrl, fmt, 14, y, imgW, maxImgH)
    y += maxImgH + 10
  } catch {
    doc.text('Leaf image could not be embedded in this PDF.', 14, y)
    y += 8
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(20, 20, 20)
  doc.text('Plant identification', 14, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(params.plantLabel, 14, y)
  y += 6

  const plantConfidencePercent = (params.plantScore * 100).toFixed(1)
  const plantConfidenceLabel = getPlantNetConfidenceLabel(params.plantScore)
  doc.text(`PlantNet confidence: ${plantConfidenceLabel} (${plantConfidencePercent}%)`, 14, y)
  y += 8

  if (plantConfidenceLabel === 'Low') {
    doc.setFontSize(9)
    doc.setTextColor(120, 80, 20)
    const noteLines = doc.splitTextToSize(
      'Note: plant identification confidence is weak. Use this match as a hint and retake a clearer single-leaf photo if needed.',
      pageW - 28,
    )
    doc.text(noteLines, 14, y)
    y += noteLines.length * 4.5 + 5
  } else {
    y += 2
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(20, 20, 20)
  doc.text('Assessment', 14, y)
  y += 7

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Crop: ${params.analysis.cropName}`, 14, y)
  y += 6
  doc.text(`Disease / status: ${params.analysis.diseaseName}`, 14, y)
  y += 6
  doc.text(`Severity: ${params.analysis.severity}`, 14, y)
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Treatments', 14, y)
  y += 8

  params.analysis.treatments.forEach((t, index) => {
    if (y > 265) {
      doc.addPage()
      y = 18
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(`${index + 1}. ${t.name}`, 14, y)
    y += 5

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(70, 70, 70)
    doc.text(`Type: ${t.type} | Est. cost: INR ${t.averageCostInr}`, 14, y)
    y += 5

    const usageLines = doc.splitTextToSize(t.usage, pageW - 28)
    doc.text(usageLines, 14, y)
    y += usageLines.length * 4.5 + 6
  })

  doc.setTextColor(0, 0, 0)
  doc.save(`crop-disease-report-${Date.now()}.pdf`)
}
