import type React from "react"
import { useState } from "react"
import { Tag, Edit, Trash2, Eye } from "lucide-react"

interface Rubro {
  id: number
  nombre: string
  riesgo: string
  prohibiciones: string
}

const Rubros: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("Filtros")
  const [riskFilter, setRiskFilter] = useState("")
  const itemsPerPage = 10

  const rubros: Rubro[] = Array.from({ length: 45 }, (_, i) => ({
    id: i + 1,
    nombre: `Rubro ${i + 1}`,
    riesgo: ["Alto", "Medio", "Bajo"][Math.floor(Math.random() * 3)],
    prohibiciones: `Prohibición ${i + 1}`,
  }))

  const filteredRubros = rubros.filter((rubro) => {
    if (filterType === "Filtros" || filterType === "Todos") {
      return true
    }

    if (filterType === "Nombre") {
      return rubro.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    }

    if (filterType === "Riesgo") {
      return riskFilter === "" || rubro.riesgo === riskFilter
    }

    return true
  })

  const totalPages = Math.ceil(filteredRubros.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentRubros = filteredRubros.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = () => {
    setCurrentPage(1)
  }

  const handleFilterChange = (value: string) => {
    setFilterType(value)
    setSearchTerm("")
    setRiskFilter("")
    setCurrentPage(1)
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <div className="bg-slate-700 p-6 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600">

      {/* Titulo*/}
      <div className="mb-6">
        <div className="bg-slate-800 rounded-lg p-4 flex items-center justify-center">
          <Tag className="w-8 h-8 text-blue-500 mr-2" />
          <h1 className="text-3xl font-bold text-white text-center">Rubros</h1>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5 space-y-3 md:space-y-0">
        <select
          className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          value={filterType}
          onChange={(e) => handleFilterChange(e.target.value)}
        >
          <option value="Filtros">Filtros</option>
          <option value="Todos">Todos</option>
          <option value="Nombre">Nombre</option>
          <option value="Riesgo">Riesgo</option>
        </select>

        {filterType === "Nombre" && (
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
          />
        )}

        {filterType === "Riesgo" && (
          <select
            className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
          >
            <option value="">Seleccionar riesgo</option>
            <option value="Alto">Alto</option>
            <option value="Medio">Medio</option>
            <option value="Bajo">Bajo</option>
          </select>
        )}

        <button
          className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-slate-900 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Riesgo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prohibiciones</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentRubros.map((rubro) => (
                <tr key={rubro.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{rubro.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rubro.nombre}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        rubro.riesgo === "Alto"
                          ? "bg-red-100 text-red-800"
                          : rubro.riesgo === "Medio"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {rubro.riesgo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{rubro.prohibiciones}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                        onClick={() => console.log(`Ver detalles del rubro ${rubro.id}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm font-medium text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-700 text-white hover:bg-blue-400"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Rubros
