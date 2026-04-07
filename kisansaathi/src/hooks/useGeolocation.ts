// src/hooks/useGeolocation.ts
import { useState, useEffect } from 'react'

interface Coords { lat: number; lon: number; accuracy?: number }

export function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported')
      return
    }
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude, accuracy: pos.coords.accuracy })
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      },
      { timeout: 10000, maximumAge: 5 * 60 * 1000 }
    )
  }

  useEffect(() => { requestLocation() }, [])

  return { coords, error, loading, retry: requestLocation }
}
