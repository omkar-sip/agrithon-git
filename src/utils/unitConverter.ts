// src/utils/unitConverter.ts
export const kgToQuintal = (kg: number) => +(kg / 100).toFixed(2)
export const quintalToKg = (q: number) => q * 100
export const lToMl = (l: number) => l * 1000
export const mlToL = (ml: number) => +(ml / 1000).toFixed(2)
export const acreToHectare = (acre: number) => +(acre * 0.4047).toFixed(2)
export const hectareToAcre = (ha: number) => +(ha * 2.471).toFixed(2)

// Price conversions for farmers
export const pricePerKgToPerQuintal = (pkkg: number) => pkkg * 100
export const pricePerQuintalToPerKg = (pquintal: number) => +(pquintal / 100).toFixed(2)

// Feed conversions
export const gramsPerKgBodyWeight = (bodyWeightKg: number, grams: number) => +(bodyWeightKg * grams / 1000).toFixed(2)

export const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

export const formatWeight = (kg: number) =>
  kg >= 100 ? `${kgToQuintal(kg)} qtl` : `${kg} kg`
