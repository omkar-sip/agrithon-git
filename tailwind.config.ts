import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ── Color Palette — "AgriTech Orange" ──────────────────────────────
      colors: {
        // Primary brand — warm professional orange
        brand: {
          50:  '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#E8652B',  // primary CTA
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        // Legacy green — kept for status & backward compat
        forest: {
          50:  '#F0FAF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#1B4332',
          950: '#052E16',
        },
        // Accent — muted professional gold
        gold: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#D4A017',
          600: '#B45309',
          700: '#92400E',
        },
        // Neutral — Apple-inspired warm grays
        neutral: {
          0:   '#FFFFFF',
          50:  '#F9FAFB',
          100: '#F3F4F6',
          150: '#EFEFEF',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
          950: '#0B0F14',
        },
        // Status
        success: { 50: '#F0FDF4', 100: '#DCFCE7', 500: '#22C55E', 700: '#15803D', 900: '#14532D' },
        warning: { 50: '#FFFBEB', 100: '#FEF3C7', 500: '#F59E0B', 700: '#B45309', 900: '#78350F' },
        danger:  { 50: '#FFF1F2', 100: '#FFE4E6', 500: '#EF4444', 700: '#B91C1C', 900: '#7F1D1D' },
        info:    { 50: '#F0F9FF', 100: '#E0F2FE', 500: '#0EA5E9', 700: '#0369A1', 900: '#0C4A6E' },
        // Legacy aliases
        harvest: { 50: '#FFFBEB', 200: '#FDE68A', 400: '#FBBF24', 600: '#D97706' },
        sky:     { 50: '#F0F9FF', 100: '#E0F2FE', 400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1' },
        mango:   { 500: '#F97316', 600: '#EA580C' },
        soil:    { 400: '#9CA3AF', 500: '#6B7280', 600: '#4B5563', 700: '#374151', 800: '#1F2937' },
        cream:   '#F9FAFB',
        parchment: '#E5E7EB',
      },

      // ── Typography ────────────────────────────────────────────────────
      fontFamily: {
        display: ['Baloo 2', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        xs:   ['11px', { lineHeight: '16px', letterSpacing: '0.02em' }],
        sm:   ['13px', { lineHeight: '20px' }],
        base: ['15px', { lineHeight: '24px' }],
        lg:   ['17px', { lineHeight: '26px' }],
        xl:   ['20px', { lineHeight: '28px' }],
        '2xl':['24px', { lineHeight: '32px' }],
        '3xl':['30px', { lineHeight: '38px' }],
        '4xl':['36px', { lineHeight: '44px' }],
      },

      // ── Spacing ─────────────────────────────────────────────────────
      spacing: {
        'safe-top':    'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'nav':         '72px',   // bottom nav height (taller for center button)
        'topbar':      '56px',
      },

      // ── Border radius ───────────────────────────────────────────────
      borderRadius: {
        DEFAULT: '8px',
        sm:  '6px',
        md:  '10px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '20px',
        '3xl': '24px',
        full: '9999px',
      },

      // ── Shadows ─────────────────────────────────────────────────────
      boxShadow: {
        'card':       '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'card-md':    '0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)',
        'card-lg':    '0 8px 24px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.05)',
        'card-hover': '0 8px 30px rgba(0,0,0,0.12)',
        'fab':        '0 4px 20px rgba(232,101,43,0.40)',
        'modal':      '0 20px 60px rgba(0,0,0,0.18)',
        'topbar':     '0 1px 0 rgba(0,0,0,0.08)',
        'inner':      'inset 0 1px 3px rgba(0,0,0,0.06)',
        'scanner':    '0 0 0 4px rgba(232,101,43,0.3)',
      },

      // ── Screens ─────────────────────────────────────────────────────
      screens: {
        xs:  '375px',
        sm:  '640px',
        md:  '768px',
        lg:  '1024px',
        xl:  '1280px',
        '2xl': '1536px',
      },

      // ── Animations ──────────────────────────────────────────────────
      keyframes: {
        'fade-in':    { '0%': { opacity: '0', transform: 'translateY(6px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'slide-up':   { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'pulse-ring': { '0%': { transform: 'scale(0.95)', opacity: '1' }, '100%': { transform: 'scale(1.4)', opacity: '0' } },
        'wave':       { '0%,100%': { transform: 'scaleY(0.5)' }, '50%': { transform: 'scaleY(1.5)' } },
        'shimmer':    { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'scan-line':  { '0%': { top: '0%' }, '50%': { top: '95%' }, '100%': { top: '0%' } },
      },
      animation: {
        'fade-in':    'fade-in 0.25s ease-out',
        'slide-up':   'slide-up 0.3s ease-out',
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'wave-1':     'wave 0.9s ease-in-out -0.45s infinite',
        'wave-2':     'wave 0.9s ease-in-out -0.30s infinite',
        'wave-3':     'wave 0.9s ease-in-out -0.15s infinite',
        'wave-4':     'wave 0.9s ease-in-out 0s infinite',
        'wave-5':     'wave 0.9s ease-in-out 0.15s infinite',
        'shimmer':    'shimmer 2s linear infinite',
        'scan-line':  'scan-line 2.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
