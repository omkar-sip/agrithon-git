import { useEffect } from 'react'
import L, { type LeafletMouseEvent } from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

const FARM_MARKER_ICON = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

type Coords = {
  lat: number
  lon: number
}

interface FarmLocationMapProps {
  center: Coords
  onChange: (coords: Coords) => void
}

function MapViewport({ center }: { center: Coords }) {
  const map = useMap()

  useEffect(() => {
    map.setView([center.lat, center.lon], map.getZoom(), { animate: true })
  }, [center, map])

  return null
}

function LocationEvents({ onChange }: { onChange: (coords: Coords) => void }) {
  useMapEvents({
    click: (event: LeafletMouseEvent) => {
      onChange({ lat: event.latlng.lat, lon: event.latlng.lng })
    },
  })

  return null
}

export default function FarmLocationMap({ center, onChange }: FarmLocationMapProps) {
  return (
    <MapContainer
      center={[center.lat, center.lon]}
      zoom={13}
      scrollWheelZoom={false}
      className="h-72 w-full rounded-[22px]"
    >
      <MapViewport center={center} />
      <LocationEvents onChange={onChange} />
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        draggable
        icon={FARM_MARKER_ICON}
        position={[center.lat, center.lon]}
        eventHandlers={{
          dragend: event => {
            const marker = event.target
            const next = marker.getLatLng()
            onChange({ lat: next.lat, lon: next.lng })
          },
        }}
      />
    </MapContainer>
  )
}
