import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import { MapPin, Trash2, Save } from "lucide-react"
import "leaflet/dist/leaflet.css"
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

const FlyToMarker = ({ position }: { position: LatLngExpression | null }) => {
  const map = useMap()
  if (position) {
    map.flyTo(position, 17)
  }
  return null
}

// Component map clicks
function MapClickHandler({ onMapClick }: { onMapClick: (latlng: LatLngExpression) => void }) {
  useMapEvents({
    click: (e) => {
      onMapClick([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

const MapComponent: React.FC = () => {
  // Catamarca COORDENADAS y Guardado de pines
  const defaultCenter: LatLngExpression = [-28.4696, -65.7852]
  const [markers, setMarkers] = useState<MarkerData[]>(() => {
  try {
    const saved = localStorage.getItem("mapMarkers")
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
})

  const [selectedPosition, setSelectedPosition] = useState<LatLngExpression | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  useEffect(() => {
    try {
      console.log("Saving markers to localStorage:", markers.length, "markers")
      console.log("Markers data:", markers)
      localStorage.setItem("mapMarkers", JSON.stringify(markers))
      console.log("Markers saved successfully to localStorage")

      // Verify the save worked
      const verification = localStorage.getItem("mapMarkers")
      console.log("Verification - data in localStorage:", verification)
    } catch (error) {
      console.error("Error saving markers to localStorage:", error)
    }
  }, [markers])

  const handleMapClick = useCallback((position: LatLngExpression) => {
    setSelectedPosition(position)
    setShowForm(true)
    setFormData({ title: "", description: "" })
  }, [])

  const handleSaveMarker = () => {
    if (selectedPosition && formData.title.trim()) {
      console.log("[v0] Creating new marker with data:", {
        position: selectedPosition,
        title: formData.title,
        description: formData.description,
      })

      const newMarker: MarkerData = {
        id: Date.now().toString(),
        position: selectedPosition,
        title: formData.title,
        description: formData.description,
      }

      console.log("New marker created:", newMarker)
      setMarkers((prev) => {
        const updated = [...prev, newMarker]
        console.log("Updated markers array:", updated)
        return updated
      })

      setShowForm(false)
      setSelectedPosition(null)
      setFormData({ title: "", description: "" })
    } else {
      console.log("Cannot save marker - missing data:", {
        selectedPosition,
        title: formData.title.trim(),
      })
    }
  }

  const handleDeleteMarker = (id: string) => {
    console.log("Deleting marker with id:", id)
    setMarkers((prev) => {
      const updated = prev.filter((marker) => marker.id !== id)
      console.log("Markers after deletion:", updated)
      return updated
    })
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setSelectedPosition(null)
    setFormData({ title: "", description: "" })
  }

const [query, setQuery] = useState("")
const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null)

const filtered = markers.filter((m) =>
  m.title.toLowerCase().includes(query.toLowerCase())
)



  return (
    <div className="h-screen flex flex-col bg-gray-50 rounded-lg">
      {/* Header */}
      <div className="bg-slate-800 shadow-sm rounded-lg border-black p-4 ">
        <div className="max-w-7xl mx-auto ">
          <div className="flex justify-center items-center gap-3 ">
            <MapPin className="text-red-500" size={40} />
            <div>
              <h1 className="text-2xl font-bold text-white">Mapa de Ubicaciones</h1>
              <p className="text-gray-200 text-sm">Haz click en el mapa para agregar una Nueva Ubicación</p>
            </div>



{/* Buscador */}
<div className=" flex-auto p-4 bg-slate-600 shadow rounded-lg max-w-md mx-auto mt-4 mb-4">
  <div className="relative">
    <input
      type="text"
      placeholder="Buscar ubicación..."
      className="p-2 border rounded w-full pr-8" 
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    {query && (
      <button
        type="button"
        onClick={() => setQuery("")}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-red-700"
      >
        ✕
      </button>
    )}
  </div>

  {query && (
    <ul className="border rounded max-h-40 overflow-y-auto bg-white mt-1">
      {filtered.length > 0 ? (
        filtered.map((m) => (
          <li
            key={m.id}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => {
              setSelectedMarker(m)
              setQuery(m.title)
            }}
          >
            {m.title}
          </li>
        ))
      ) : (
        <li className="p-2 text-gray-500">No se encontraron resultados</li>
      )}
    </ul>
  )}
</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative ">
        <MapContainer center={defaultCenter} zoom={13} className="h-full w-full z-0" zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler onMapClick={handleMapClick} />

          {/* Existing markers */}
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.position}>
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-black mb-2">{marker.title}</h3>
                  {marker.description && <p className="text-black text-sm mb-3">{marker.description}</p>}
                  <button
                    onClick={() => handleDeleteMarker(marker.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-400 text-sm"
                  >
                    <Trash2 size={17} />
                    Eliminar
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Temporary marker for selected position */}
          {/* {selectedPosition && (
            <Marker position={selectedPosition}>
              <Popup>
                <div className="p-2">
                  <p className="text-gray-600 text-sm">Nueva ubicación seleccionada</p>
                </div>
              </Popup>
            </Marker>
          )} */}

         {selectedMarker && <FlyToMarker position={selectedMarker.position} />}
        </MapContainer>

        {/* Form Modal */}
        {showForm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Ubicación</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Título (*)</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))} 
                    maxLength={200}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent break-words" //hace que las cadenas de texto largas hagan quiebre
                    placeholder="Descripción..."
                    rows={3}
                  />
                   {/* Contador caracteres */}
                   <p className="text-xs text-gray-500 mt-1">
                   {formData.description.length}/200
                   </p>
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
              </div>

            </div>
        )}

        {/* Markers Counter */}
        {markers.length > 0 && (
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-green-600" />
              <span>
                {markers.length} Ubicación{markers.length !== 1 ? "es" : ""} marcada{markers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MapComponent
