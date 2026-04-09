import { useEffect } from 'react'
import { ExternalLink, Landmark, LoaderCircle } from 'lucide-react'
import Card from '../../components/ui/Card'
import PageTransition from '../../components/layout/PageTransition'
import { GOVERNMENT_FARMER_PORTAL_URL, openExternalUrl } from '../../utils/externalLinks'

export default function GovernmentSchemesRedirect() {
  useEffect(() => {
    const redirectTimer = window.setTimeout(() => {
      openExternalUrl(GOVERNMENT_FARMER_PORTAL_URL)
    }, 180)

    return () => window.clearTimeout(redirectTimer)
  }, [])

  return (
    <PageTransition>
      <div className="mx-auto flex min-h-full w-full max-w-3xl items-center px-4 py-6">
        <Card className="w-full rounded-[30px] border border-indigo-100 bg-gradient-to-br from-indigo-700 via-indigo-600 to-cyan-500 p-6 text-white shadow-card-md sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/70">Official portal</p>
              <h1
                className="mt-2 text-3xl font-black"
                style={{ fontFamily: 'Baloo 2, sans-serif' }}
              >
                Redirecting to Sarkari Yojana
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-white/90">
                You are being redirected to the Government of India Farmers&apos; Portal for official agriculture schemes, guidance, and farmer resources.
              </p>
            </div>
            <div className="rounded-3xl bg-white/15 p-3">
              <Landmark size={26} />
            </div>
          </div>

          <div className="mt-6 rounded-[24px] bg-white/12 p-4">
            <div className="flex items-center gap-3 text-sm font-semibold">
              <LoaderCircle size={18} className="animate-spin" />
              Opening official website...
            </div>
            <p className="mt-2 text-xs leading-6 text-white/80">
              If the redirect does not happen automatically, use the button below.
            </p>
          </div>

          <button
            type="button"
            onClick={() => openExternalUrl(GOVERNMENT_FARMER_PORTAL_URL)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-card transition hover:bg-indigo-50 active:scale-[0.98]"
          >
            Open official Farmers&apos; Portal
            <ExternalLink size={16} />
          </button>
        </Card>
      </div>
    </PageTransition>
  )
}
