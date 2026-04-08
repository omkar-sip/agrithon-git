// src/utils/colorSystem.ts — all labels English only
export type StatusColor = 'green' | 'yellow' | 'red' | 'blue' | 'orange'

export const COLOR_CONFIG: Record<StatusColor, {
  bg: string
  border: string
  text: string
  badge: string
  icon: string
  label: string
}> = {
  green: {
    bg:     'bg-forest-50',
    border: 'border-l-4 border-forest-500',
    text:   'text-forest-700',
    badge:  'bg-forest-500 text-white',
    icon:   '🟢',
    label:  'Safe',
  },
  yellow: {
    bg:     'bg-harvest-50',
    border: 'border-l-4 border-harvest-400',
    text:   'text-harvest-700',
    badge:  'bg-harvest-400 text-white',
    icon:   '🟡',
    label:  'Caution',
  },
  red: {
    bg:     'bg-red-50',
    border: 'border-l-4 border-danger-500',
    text:   'text-danger-700',
    badge:  'bg-danger-500 text-white',
    icon:   '🔴',
    label:  'Urgent',
  },
  blue: {
    bg:     'bg-sky-50',
    border: 'border-l-4 border-sky-500',
    text:   'text-sky-700',
    badge:  'bg-sky-500 text-white',
    icon:   '🔵',
    label:  'Weather / Water',
  },
  orange: {
    bg:     'bg-orange-50',
    border: 'border-l-4 border-mango-500',
    text:   'text-mango-600',
    badge:  'bg-mango-500 text-white',
    icon:   '🟠',
    label:  'Market Alert',
  },
}

export const getColor = (color: StatusColor) => COLOR_CONFIG[color]

export const priorityToColor = (priority: 'high' | 'medium' | 'low'): StatusColor => {
  if (priority === 'high')   return 'red'
  if (priority === 'medium') return 'yellow'
  return 'green'
}

export const urgencyToColor = (urgency: string): StatusColor => {
  const u = urgency.toUpperCase()
  if (u.includes('EMERGENCY')) return 'red'
  if (u.includes('TODAY'))     return 'yellow'
  return 'green'
}

export const CATEGORY_COLORS: Record<string, { primary: string; bg: string; emoji: string }> = {
  crop:      { primary: 'forest-500',  bg: 'bg-forest-50',  emoji: '🌾' },
  livestock: { primary: 'harvest-400', bg: 'bg-harvest-50', emoji: '🐄' },
  poultry:   { primary: 'mango-500',   bg: 'bg-orange-50',  emoji: '🐓' },
  fishery:   { primary: 'sky-500',     bg: 'bg-sky-50',     emoji: '🐟' },
}
