"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { UserCheck, Eye, Plus, X, Edit, ShieldBan } from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent";

interface Inspector {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  activo: boolean;
  funcion: string;
  identificador: string;
  cuil: string;
  legajo: string;
}

const Inspectores: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inspectores, setInspectores] = useState<Inspector[]>([]);

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    funcion: "",
    identificador: "",
    cuil: "",
    legajo: "",
    activo: true,
  });

  // Simulación de carga inicial
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Datos de ejemplo
      setInspectores([
        {
          id: 1,
          nombre: "Inspector 1",
          apellido: "Apellido 1",
          email: "inspector1@catamarca.gov.ar",
          activo: true,
          funcion: "Sur",
          identificador: "37750108",
          cuil: "20-37750108-3",
          legajo: "1234",
        },
        {
          id: 2,
          nombre: "Inspector 2",
          apellido: "Apellido 2",
          email: "inspector2@catamarca.gov.ar",
          activo: false,
          funcion: "Oeste",
          identificador: "46833456",
          cuil: "20-46833456-9",
          legajo: "5678",
        },
      ]);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // 🔗 Endpoints simulados (para que los conectes luego)
  const getInspectores = async () => {
    // const res = await fetch("TU_ENDPOINT_GET");
    // const data = await res.json();
    // setInspectores(data);
  };

  const createInspector = async (newInspector: Omit<Inspector, "id">) => {
    // const res = await fetch("TU_ENDPOINT_POST", { method: "POST", body: JSON.stringify(newInspector) });
    // const data = await res.json();
    // setInspectores([...inspectores, data]);
  };

  const updateInspector = async (
    id: number,
    updatedData: Partial<Inspector>
  ) => {
    // await fetch(`TU_ENDPOINT_PUT/${id}`, { method: "PUT", body: JSON.stringify(updatedData) });
  };

  const deleteInspector = async (id: number) => {
    // await fetch(`TU_ENDPOINT_DELETE/${id}`, { method: "DELETE" });
  };

  // Filtros
  const filteredInspectores = inspectores.filter((inspector) => {
    if (!filterType || !searchTerm) return true;
    if (filterType === "apellido")
      return inspector.apellido
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    if (filterType === "identificador")
      return inspector.identificador.includes(searchTerm);
    return true;
  });

  const totalPages = Math.ceil(filteredInspectores.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentInspectores = filteredInspectores.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handleSearch = () => setCurrentPage(1);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInspector(null);
  };

  const handleViewDetails = (inspector: Inspector) => {
    setSelectedInspector(inspector);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInspector: Inspector = {
      id: inspectores.length + 1,
      ...formData,
    };
    setInspectores([...inspectores, newInspector]);
    // Llamar a createInspector(newInspector) cuando tengas el backend
    setFormData({
      nombre: "",
      apellido: "",
      email: "",
      funcion: "",
      identificador: "",
      cuil: "",
      legajo: "",
      activo: true,
    });
    setIsFormOpen(false);
  };

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Inspectores..."
      minHeight="400px"
    >
      <>
        <div className="bg-slate-700 p-6 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600 ">
          {/* Titulo */}
          <div className="mb-6">
            <div className="bg-slate-800 rounded-lg p-4 flex justify-center items-center">
              <UserCheck className="w-8 h-8 text-blue-500 mr-2" />
              <h1 className="text-3xl font-bold text-white text-center">
                Inspectores
              </h1>
            </div>
          </div>

          {/* Filtros + boton nuevo inspector */}
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-5 space-y-3 md:space-y-0 justify-between">
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
              <select
                className="border border-gray-100 rounded-lg px-3 py-1 text-sm text-black"
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                <option value="">Filtros</option>
                <option value="apellido">Apellido</option>
                <option value="identificador">Identificador</option>
              </select>
              {filterType && (
                <input
                  type="text"
                  placeholder={`Buscar por ${filterType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border border-gray-100 rounded-lg px-3 py-1 text-sm"
                />
              )}
              <button
                className="flex items-center px-4 py-2 bg-blue-700 text-white text-sm rounded-lg hover:bg-blue-400 transition-colors"
                onClick={handleSearch}
              >
                Buscar
              </button>
            </div>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-300 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Inspector</span>
            </button>
          </div>

          {/* Tabla */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Apellido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Activo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Función
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Identificador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentInspectores.length > 0 ? (
                    currentInspectores.map((inspector) => (
                      <tr key={inspector.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {inspector.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {inspector.nombre}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {inspector.apellido}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {inspector.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              inspector.activo
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {inspector.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {inspector.funcion}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {inspector.identificador}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                              onClick={() => handleViewDetails(inspector)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="text-blue-600 hover:text-blue-900 transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="text-red-600 hover:text-red-900 transition-colors">
                              <ShieldBan className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-4 text-center text-sm text-gray-500"
                      >
                        No se encontraron inspectores que coincidan con los
                        criterios de búsqueda.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="bg-white px-4 py-3 border-t border-gray-200">
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

        {/* MODAL DETALLES */}
        {isModalOpen && selectedInspector && (
          <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-600 rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="space-y-6 text-center text-white">
                <h2 className="text-2xl font-bold">
                  {selectedInspector.nombre} {selectedInspector.apellido}
                </h2>
                <p>Email: {selectedInspector.email}</p>
                <p>CUIL: {selectedInspector.cuil}</p>
                <p>Legajo: {selectedInspector.legajo}</p>
                <p>Función: {selectedInspector.funcion}</p>
                <p>Identificador: {selectedInspector.identificador}</p>
              </div>
            </div>
          </div>
        )}

        {/* FORMULARIO NUEVO INSPECTOR */}
        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <form
              onSubmit={handleFormSubmit}
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">
                Agregar Nuevo Inspector
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={(e) =>
                    setFormData({ ...formData, apellido: e.target.value })
                  }
                  required
                  className="border rounded p-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="border rounded p-2 col-span-2"
                />
                <input
                  type="text"
                  placeholder="Función"
                  value={formData.funcion}
                  onChange={(e) =>
                    setFormData({ ...formData, funcion: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Identificador"
                  value={formData.identificador}
                  onChange={(e) =>
                    setFormData({ ...formData, identificador: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="CUIL"
                  value={formData.cuil}
                  onChange={(e) =>
                    setFormData({ ...formData, cuil: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Número de Legajo"
                  value={formData.legajo}
                  onChange={(e) =>
                    setFormData({ ...formData, legajo: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>

              <div className="flex items-center mt-3 space-x-2">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) =>
                    setFormData({ ...formData, activo: e.target.checked })
                  }
                />
                <label>Activo</label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-2 rounded mt-4 hover:bg-blue-500 transition-colors"
              >
                Guardar Inspector
              </button>
            </form>
          </div>
        )}
      </>
    </LoaderContent>
  );
};

export default Inspectores;
