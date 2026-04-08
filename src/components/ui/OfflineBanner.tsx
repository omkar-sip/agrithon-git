// src/components/ui/OfflineBanner.tsx — English only
import { WifiOff } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function OfflineBanner() {
  const { t } = useTranslation()
  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-harvest-400 text-white px-4 py-2 flex items-center gap-2 shadow-md">
      <WifiOff size={16} className="shrink-0" />
      <p className="text-sm font-body">{t('status.offline')}</p>
    </div>
  )
}
