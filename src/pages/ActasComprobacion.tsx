
import type React from "react"
import { useState } from "react"
import { ClipboardCheck, ChevronLeft, ChevronRight, Eye } from "lucide-react"

const ActasComprobacion: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filterType, setFilterType] = useState("Todos")
  const [filterValue, setFilterValue] = useState("")
  const itemsPerPage = 10

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
    {
      id: 2,
      numero: "AC-2024-002",
      propietarios: "Roberto Silva",
      nJuzgado: "JUZ-002",
      creado: "2024-01-19",
      nombreFantasia: "Kiosko Sol",
      razonSocial: "Silva & Hijos SRL",
    },
    {
      id: 3,
      numero: "AC-2024-003",
      propietarios: "Laura Martínez, Carlos López",
      nJuzgado: "JUZ-003",
      creado: "2024-01-20",
      nombreFantasia: "Panadería San Juan",
      razonSocial: "Martínez Panificados",
    },
    ...Array.from({ length: 270 }, (_, i) => ({
      id: i + 4,
      numero: `AC-2024-${String(i + 4).padStart(3, "0")}`,
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

  // --- Filtro ---
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
  const endIndex = startIndex + itemsPerPage
  const currentActas = filteredActas.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div className=" bg-slate-700 p-6 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600">
      <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0 pb-5">
        <div className="flex flex-col space-y-3 md:flex-row md:items-center md:space-x-4 md:space-y-0">
          <div className="flex items-center space-x-3">
            <ClipboardCheck className="w-8 h-8 text-green-500" />
            <h1 className="text-2xl font-bold text-white">
              Actas de Comprobacion
            </h1>
          </div>

          {/* Selector de filtro */}
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

          {/* Input para el valor */}
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Número
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Propietarios
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Juzgado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Creado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detalles
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentActas.map((acta) => (
              <tr key={acta.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {acta.numero}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {acta.propietarios}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {acta.nJuzgado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {acta.creado}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button className="text-blue-600 hover:text-blue-800 transition-colors">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}

            {currentActas.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-4 text-gray-500 italic"
                >
                  No se encontraron resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
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
                ? "bg-gray-100 text-white cursor-not-allowed"
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

export default ActasComprobacion
