"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import { MapPin, Trash2, Save } from "lucide-react"
import "leaflet/dist/leaflet.css"

// Fix for default markers in react-leaflet
import L from "leaflet"
import markerIcon from "leaflet/dist/images/marker-icon.png"
import markerShadow from "leaflet/dist/images/marker-shadow.png"
import markerRetina from "leaflet/dist/images/marker-icon-2x.png"

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerRetina,
  shadowUrl: markerShadow,
})

interface MarkerData {
  id: string
  position: LatLngExpression
  title: string
  description: string
}

// Component to handle map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLngExpression) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

const MapComponent: React.FC = () => {
  // Coordenadas de catamarca
  const defaultCenter: LatLngExpression = [-28.4696, -65.7852]
  const [markers, setMarkers] = useState<MarkerData[]>([])
  const [selectedPosition, setSelectedPosition] = useState<LatLngExpression | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const handleMapClick = useCallback((position: LatLngExpression) => {
    setSelectedPosition(position)
    setShowForm(true)
    setFormData({ title: "", description: "" })
  }, [])

  const handleSaveMarker = () => {
    if (selectedPosition && formData.title.trim()) {
      const newMarker: MarkerData = {
        id: Date.now().toString(),
        position: selectedPosition,
        title: formData.title,
        description: formData.description,
      }
      setMarkers((prev) => [...prev, newMarker])
      setShowForm(false)
      setSelectedPosition(null)
      setFormData({ title: "", description: "" })
    }
  }

  const handleDeleteMarker = (id: string) => {
    setMarkers((prev) => prev.filter((marker) => marker.id !== id))
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setSelectedPosition(null)
    setFormData({ title: "", description: "" })
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-gray-400 shadow-sm border-b border-gray-500 p-4 rounded-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <MapPin className="text-green-600" size={24} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mapa de Ubicaciones</h1>
              <p className="text-gray-600 text-sm">Haz clic en el mapa para agregar una nueva ubicación</p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <MapContainer center={defaultCenter} zoom={13} className="h-full w-full" zoomControl={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {/* markers */}
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.position}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-gray-900 mb-1">{marker.title}</h3>
                  {marker.description && <p className="text-gray-600 text-sm mb-3">{marker.description}</p>}
                  <button
                    onClick={() => handleDeleteMarker(marker.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                  >
                    <Trash2 size={14} />
                    Eliminar
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Temporary marker for selected position */}
          {selectedPosition && (
            <Marker position={selectedPosition}>
              <Popup>
                <div className="p-2">
                  <p className="text-gray-600 text-sm">Nueva ubicación seleccionada</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Form Modal */}
        {showForm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Ubicación</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Ej: Comercio ABC"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Descripción opcional..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveMarker}
                  disabled={!formData.title.trim()}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={16} />
                  Guardar
                </button>
                <button
                  onClick={handleCancelForm}
                  className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Markers Counter */}
        {markers.length > 0 && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[999]">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-green-600" />
              <span>
                {markers.length} ubicación{markers.length !== 1 ? "es" : ""} marcada{markers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapComponent
