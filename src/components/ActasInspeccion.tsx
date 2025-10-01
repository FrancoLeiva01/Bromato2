"use client"

import type React from "react"
import { useState } from "react"
import { Search, ChevronLeft, ChevronRight, Eye } from "lucide-react"

const ActasInspeccion: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterField, setFilterField] = useState("Todos")
  const [filterTurno, setFilterTurno] = useState("Todos")

  const itemsPerPage = 10

  const actas = [
    {
      id: 1,
      numero: "AI-2024-001",
      denuncia: "-",
      fecha: "2024-01-15",
      turno: "Tarde",
      cargado: "Completada",
      numeroNotificacion: "Aprobada",
      razonSocial: "Supermercado Catamarca SA",
      fantasia: "SuperCata",
    },
    {
      id: 2,
      numero: "AI-2024-002",
      denuncia: "-",
      fecha: "2024-01-16",
      turno: "Mañana",
      cargado: "Completada",
      numeroNotificacion: "Aprobada",
      razonSocial: "Panadería El Sol",
      fantasia: "PanSol",
    },
    {
      id: 3,
      numero: "AI-2024-003",
      denuncia: "-",
      fecha: "2024-01-17",
      turno: "Finde",
      cargado: "Completada",
      numeroNotificacion: "Aprobada",
      razonSocial: "Carnicería Los Hermanos",
      fantasia: "CarneExpress",
    },
    ...Array.from({ length: 50 }, (_, i) => ({
      id: i + 4,
      numero: `AI-2024-${String(i + 4).padStart(3, "0")}`,
      denuncia: "-",
      fecha: `2024-01-${String((i % 28) + 1).padStart(2, "0")}`,
      turno: ["Tarde", "Mañana", "Finde", "Noche"][i % 4],
      cargado: ["Completada", "En proceso", "Pendiente"][i % 3],
      numeroNotificacion: ["Aprobada", "Observaciones", "Rechazada"][i % 3],
      razonSocial: ["Mercado San Juan", "Kiosco 24hs", "Farmacia Central"][i % 3],
      fantasia: ["Mercadito SJ", "K24", "FarmaC"][i % 3],
    })),
  ]

  // 🔹 Filtro principal
  const filteredActas = actas.filter((acta) => {
    const term = searchTerm.toLowerCase()

    // Filtro por turno
    if (filterTurno !== "Todos" && acta.turno !== filterTurno) {
      return false
    }

    // Filtros de texto
    if (!term.trim()) return true

    switch (filterField) {
      case "Todos":
        return (
          acta.numero.toLowerCase().includes(term) ||
          acta.turno.toLowerCase().includes(term) ||
          acta.numeroNotificacion.toLowerCase().includes(term) ||
          acta.cargado.toLowerCase().includes(term) ||
          acta.razonSocial.toLowerCase().includes(term) ||
          acta.fantasia.toLowerCase().includes(term)
        )
      case "Numero":
        return acta.numero.toLowerCase().includes(term)
      case "Notificacion":
        return acta.numeroNotificacion.toLowerCase().includes(term)
      case "RazonSocial":
        return acta.razonSocial.toLowerCase().includes(term)
      case "Fantasia":
        return acta.fantasia.toLowerCase().includes(term)
      default:
        return true
    }
  })

  const totalPages = Math.ceil(filteredActas.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentActas = filteredActas.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className="bg-slate-700 p-6 rounded-lg">
      {/* 🔹 Barra de filtros */}
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 pb-5">
        <div className="flex items-center space-x-3">
          <Search className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-white">Actas de Inspección</h1>
        </div>

        {/* Selección de campo a filtrar */}
        <select
          className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          value={filterField}
          onChange={(e) => setFilterField(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Numero">N° de Acta</option>
          <option value="Notificacion">Notificación</option>
          <option value="RazonSocial">Razón Social Comercio</option>
          <option value="Fantasia">Nombre de Fantasía</option>
        </select>

        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value)
            setCurrentPage(1)
          }}
          className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
        />

        {/* Filtro de turno con select */}
        <select
          className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          value={filterTurno}
          onChange={(e) => {
            setFilterTurno(e.target.value)
            setCurrentPage(1)
          }}
        >
          <option value="Todos">Todos los turnos</option>
          <option value="Mañana">Mañana</option>
          <option value="Tarde">Tarde</option>
          <option value="Noche">Noche</option>
          <option value="Finde">Finde</option>
        </select>
      </div>

      {/* 🔹 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Número de Acta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Denuncia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turno</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Razón Social</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fantasia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cargado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notificación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalles</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentActas.map((acta) => (
              <tr key={acta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{acta.numero}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{acta.denuncia}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acta.fecha}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acta.turno}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acta.razonSocial}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{acta.fantasia}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      acta.cargado === "Completada"
                        ? "bg-green-100 text-green-800"
                        : acta.cargado === "En proceso"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {acta.cargado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      acta.numeroNotificacion === "Aprobada"
                        ? "bg-green-100 text-green-800"
                        : acta.numeroNotificacion === "Observaciones"
                        ? "bg-orange-100 text-orange-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {acta.numeroNotificacion}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg"
                    onClick={() => console.log(`Ver detalles del acta ${acta.numero}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginación */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-2">
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
      </div>
    </div>
  )
}

export default ActasInspeccion
