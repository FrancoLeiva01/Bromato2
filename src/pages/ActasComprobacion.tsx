"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ClipboardCheck, ChevronLeft, ChevronRight, Eye, Plus, X } from "lucide-react"
import ComprobacionData from "@/components/ComprobacionData"
import { LoaderContent } from "@/components/LoaderComponent"

const ActasComprobacion: React.FC = () => {
   const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState("Todos")
  const [filterValue, setFilterValue] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedActa, setSelectedActa] = useState<(typeof actas)[0] | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const itemsPerPage = 10


  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])


  const actas = [
    {
      id: 1,
      numero: "AC-2024-001",
      propietarios: "Juan Pérez, María García",
      nJuzgado: "JUZ-001",
      creado: "2024-01-18",
      nombreFantasia: "Supermercado La Plaza",
      razonSocial: "Comercial La Plaza S.A.",
    },
    ...Array.from({ length: 270 }, (_, i) => ({
      id: i + 2,
      numero: `AC-2024-${String(i + 2).padStart(3, "0")}`,
      propietarios: [
        "Ana López, Pedro Rodríguez",
        "Carlos Martínez",
        "Elena González, Miguel Torres",
        "Fernando Díaz",
        "Isabel Ruiz, Jorge Morales",
      ][i % 5],
      nJuzgado: `JUZ-${String((i % 10) + 1).padStart(3, "0")}`,
      creado: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
      nombreFantasia: [
        "Supermercado Central",
        "Kiosko Las Flores",
        "Farmacia San Martín",
        "Panadería El Trigal",
        "Verdulería Don Pepe",
      ][i % 5],
      razonSocial: [
        "Comercial Central S.A.",
        "Distribuidora Las Flores",
        "Farmacéutica SM SRL",
        "Panificados El Trigal",
        "Hortalizas Pepe SRL",
      ][i % 5],
    })),
  ]

  const filteredActas = actas.filter((acta) => {
    if (!filterValue) return true
    const value = filterValue.toLowerCase()
    switch (filterType) {
      case "Todos":
        return (
          acta.numero.toLowerCase().includes(value) ||
          acta.propietarios.toLowerCase().includes(value) ||
          acta.nombreFantasia.toLowerCase().includes(value) ||
          acta.razonSocial.toLowerCase().includes(value)
        )
      case "Numero":
        return acta.numero.toLowerCase().includes(value)
      case "Propietario":
        return acta.propietarios.toLowerCase().includes(value)
      case "Fantasia":
        return acta.nombreFantasia.toLowerCase().includes(value)
      case "Razon":
        return acta.razonSocial.toLowerCase().includes(value)
      default:
        return true
    }
  })

  const totalPages = Math.ceil(filteredActas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentActas = filteredActas.slice(startIndex, startIndex + itemsPerPage)

  const handlePreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

  const handleViewDetails = (acta: (typeof actas)[0]) => {
    setSelectedActa(acta)
    setIsModalOpen(true)
  }

  return (
     <LoaderContent isLoading={isLoading} loadingText="Cargando..." minHeight="400px">

    <div className="bg-slate-700 p-6 rounded-lg shadow-lg shadow-gray-600 ">
      {/* Título centrado */}
      <div className="mb-6">
        <div className="bg-slate-800 p-4 rounded-lg flex justify-center items-center shadow-inner">
          <ClipboardCheck className="w-8 h-8 text-green-500 mr-2" />
          <h1 className="text-3xl font-bold text-white text-center">Actas de Comprobación</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5 space-y-3 md:space-y-0 justify-between">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          >
            <option value="Todos">Todos</option>
            <option value="Numero">N° de Acta de Comprobación</option>
            <option value="Propietario">Propietario</option>
            <option value="Fantasia">Nombre de Fantasía Comercio</option>
            <option value="Razon">Razón Social Comercio</option>
          </select>

          <input
            type="text"
            placeholder="Buscar..."
            value={filterValue}
            onChange={(e) => {
              setCurrentPage(1)
              setFilterValue(e.target.value)
            }}
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          />
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Acta de Comprobacion</span>
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propietarios</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Juzgado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Creado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentActas.map((acta) => (
              <tr key={acta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{acta.numero}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{acta.propietarios}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acta.nJuzgado}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acta.creado}</td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <button
                    onClick={() => handleViewDetails(acta)}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}

            {currentActas.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500 italic">
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginacion */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center space-x-2">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            currentPage === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-4 py-2 text-sm font-medium text-white">
          Página {currentPage} de {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-700 text-white hover:bg-blue-400"
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <ComprobacionData isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} acta={selectedActa} />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-slate-700 text-white p-6 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ClipboardCheck className="w-8 h-8 text-green-500" />
                <h2 className="text-2xl font-bold">Nueva Acta de Comprobación</h2>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="text-white hover:text-red-300 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Content - Scrollable */}
            <div className="overflow-y-auto flex-1 p-6 bg-slate-500">
              <form className="space-y-6">
                {/* Sección 1: DATOS DEL ACTA */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">1. Datos del Acta</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Acta de Inspección</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="Número de acta"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Acta</label>
                      <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Sección 2: DATOS DEL COMERCIO */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">2. Datos del Comercio</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre/Razón Social</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Nombre o razón social"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CUIT/CUIL</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="XX-XXXXXXXX-X"
                        />
                      </div>
                    </div>

                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="accent-green-600" />
                      <span className="text-sm font-medium text-gray-700">Permito Inspección</span>
                    </label>
                  </div>
                </div>

                {/* Sección 3: DATOS DE QUIEN RECIBE LA INSPECCIÓN */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                    3. Datos de Quien Recibe la Inspección
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Nombre y Apellido de persona que recibe la inspección"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="D.N.I."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Cargo/función"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección 4: DATOS DEL DOMICILIO */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">4. Datos del Domicilio</h3>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="accent-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Coincide el domicilio declarado con el inspeccionado
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="Domicilio Inspeccionado"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    />
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps</label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        placeholder="URL de Google Maps o coordenadas"
                      />
                    </div>
                  </div>
                </div>

                {/* Sección 5: INSPECTORES */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">5. Inspectores</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inspector 1</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Nombre del inspector"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Legajo 1</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Número de legajo"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Inspector 2</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Nombre del inspector"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Legajo/DNI 2</label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          placeholder="Número de legajo o DNI"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sección 6: DOCUMENTACION */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">6. Documentación</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">PDF del Acta</label>
                    <div className="border-2 border-dashed border-green-500 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                      <input type="file" accept=".pdf" className="hidden" id="pdfUpload" />
                      <label htmlFor="pdfUpload" className="cursor-pointer text-gray-500 hover:text-green-600">
                        <div className="text-4xl mb-2">📄</div>
                        <div className="text-sm">Haz click para subir un PDF</div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Sección 7: OBSERVACIONES */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">7. Observaciones</h3>
                  <textarea
                   maxLength={700}
                    rows={6}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
                    placeholder="Escriba sus observaciones aquí..."
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors ml-5"
                  >
                    Guardar Acta de Comprobación
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>


     </LoaderContent>
  )
}

export default ActasComprobacion
