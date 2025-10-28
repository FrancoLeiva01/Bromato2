import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { UserCheck, Eye, Plus, X, Edit, ShieldBan } from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent";

// Campos

interface Inspector {
  id: number;   // quitarlo?
  nombres: string;
  apellidos: string;
  activo: boolean;
  funcion?: string;
  identificador?: string; // quitarlos?
  cuil?: string;
  nro_legajo?: string;
}

export enum FUNCION_INSPECTOR {
  CONTROL_MD = "CONTROL M/D",
}


const Inspectores: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true); // Loader
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inspectores, setInspectores] = useState<Inspector[]>([]);
  const [inspectorToEdit, setInspectorToEdit] = useState<Inspector | null>(null);

  // Loader
useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    cuil: "",
    nro_legajo: "",
  });

  const API_URL = "http://localhost:4000/api/v1";
  
  const normalizeActivoFromBackend = (value: any): boolean => {
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string")
      return value.toLowerCase() === "true" || value === "1";
    return false;
  };
  
  const normalizeInspectorFromBackend = (raw: any): Inspector => {
    return {
      id: raw.id,
      nombres: raw.nombres ?? raw.nombre ?? "",
      apellidos: raw.apellidos ?? raw.apellido ?? "",
      funcion: raw.funcion ?? "",
      identificador: raw.identificador ?? raw.identificador ?? "",
      cuil: raw.cuil ?? "",
      nro_legajo: raw.nro_legajo ?? raw.legajo ?? "",
      activo: normalizeActivoFromBackend(raw.activo),
    };
  };

  
  const [totalInspectores, setTotalInspectores] = useState(0);
  
  
  // GET
  
  const getInspectores = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_URL}/inspector?page=${currentPage}`);
      console.log("Respuesta del backend:", res.data);
      
      const payload = Array.isArray(res.data)
      ? res.data
      : res.data?.data ?? res.data?.inspectores ?? res.data;
      
      const total = res.data.total ?? payload.length;
      setTotalInspectores(total);
      
      const normalized = payload.map(normalizeInspectorFromBackend);
      setInspectores(normalized);
    } catch (error) {
      console.error("Error al obtener inspectores:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    getInspectores();
  }, [currentPage]);
  
  
  // CREATE
  
  const createInspector = async (newInspector: typeof formData) => {
    try {
      const payload = {
      nombres: newInspector.nombres,
      apellidos: newInspector.apellidos,
      cuil: newInspector.cuil,
      nro_legajo: newInspector.nro_legajo,
      funcion: FUNCION_INSPECTOR.CONTROL_MD  
    };

    const res = await axios.post(`${API_URL}/inspector`, payload);
    const createdRaw = res.data?.data ?? res.data;
    const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;
    
    const normalized = normalizeInspectorFromBackend(created);
    
    // 👇 Actualiza el estado de la tabla sin depender del backend
    setInspectores((prev) => [...prev, normalized]);
    
    // Si querés actualizar desde el backend también:
    await getInspectores();
    
    alert("✅ Inspector creado exitosamente");
  } catch (error: any) {
    console.error("❌ Error al crear inspector:", error);
    alert(`Error al crear inspector: ${error.response?.data?.message || error.message}`);
  }
};

// UPDATE

const updateInspector = async (
  id: number,
  updatedData: Partial<Inspector>
) => {
  try {
    const payload = {
        nombres: updatedData.nombres,
        apellidos: updatedData.apellidos,
        cuil: updatedData.cuil,
        nro_legajo: updatedData.nro_legajo,
      };

      console.log("📤 Actualizando inspector ID:", id, "con payload:", payload);
      const res = await axios.patch(`${API_URL}/inspector/${id}`, payload);
      console.log("✅ Inspector actualizado:", res.data);
      
      // Recargar la lista completa después de actualizar
      await getInspectores();
      
      alert("✅ Inspector actualizado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al actualizar inspector:", error);
      console.error("❌ Respuesta del error:", error.response?.data);
      alert(`Error al actualizar inspector: ${error.response?.data?.message || error.message}`);
    }
  };
  
  const toggleInspectorActivo = async (inspector: Inspector) => {
    try {
      const payload = { activo: String(!inspector.activo) };
      console.log("🔄 Cambiando estado activo del inspector:", inspector.id);
      await axios.patch(`${API_URL}/inspector/${inspector.id}`, payload);
      await getInspectores();
      alert("✅ Estado actualizado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al cambiar estado:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // DELETE
  
  const deleteInspector = async (id: number) => {
    if (!confirm("¿Está seguro de que desea desactivar este inspector?")) {
      return;
    }
    
    try {
      console.log("🗑️ Desactivando inspector:", id);
      // Usar PATCH para cambiar activo a false (soft delete)
      await axios.get(`${API_URL}/inspector/delete/${id}`, { data: { activo: "false" } });
      console.log("✅ Inspector desactivado");
      
      // Recargar la lista después de desactivar
      
      await getInspectores();
      
      alert("✅ Inspector desactivado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al desactivar inspector:", error);
      console.error("❌ Respuesta del error:", error.response?.data);
      alert(`Error al desactivar inspector: ${error.response?.data?.message || error.message}`);
    }
  };
  
  // Filtrado
  const filteredInspectores = Array.isArray(inspectores)
  ? inspectores.filter((inspector) => {
    if (!filterType || !searchTerm) return true;
    if (filterType === "apellido")
      return inspector.apellidos
    .toLowerCase()
    .includes(searchTerm.toLowerCase());
    if (filterType === "identificador")
      return (inspector.identificador ?? "").includes(searchTerm);
    return true;
  })
  : [];
  
  const totalPages = Math.max(1, Math.ceil(totalInspectores / itemsPerPage));
  
  // El backend ya envía datos paginados, no necesitamos hacer slice
  const currentInspectores = filteredInspectores;
  
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
  
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInspector(formData);
    setFormData({
      nombres: "",
      apellidos: "",
      cuil: "",
      nro_legajo: "",
    });
    setIsFormOpen(false);
  };
  
  const handleEditClick = (inspector: Inspector) => {
    setInspectorToEdit(inspector);
    setEditFormData({
      nombres: inspector.nombres,
      apellidos: inspector.apellidos,
      cuil: inspector.cuil || "",
      nro_legajo: inspector.nro_legajo || "",
    });
    setIsEditModalOpen(true);
  };
  
// EDITAR INSPECTOR

  const [editFormData, setEditFormData] = useState({
    nombres: "",
    apellidos: "",
    cuil: "",
    nro_legajo: "",
  });
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inspectorToEdit) {
      await updateInspector(inspectorToEdit.id, editFormData);
      setIsEditModalOpen(false);
      setInspectorToEdit(null);
    }
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
                <thead className="bg-slate-500">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Apellido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Activo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Funcion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Identificador
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Detalles
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentInspectores.length > 0 ? (
                    currentInspectores.map((inspector) => (
                      <tr key={inspector.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {inspector.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspector.nombres}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspector.apellidos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer ${
                              inspector.activo
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                            onClick={() => toggleInspectorActivo(inspector)}
                            title="Click para cambiar estado"
                          >
                            {inspector.activo ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspector.funcion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {inspector?.nro_legajo || inspector?.cuil}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                              onClick={() => handleViewDetails(inspector)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              onClick={() => handleEditClick (inspector)}
                              title="Editar inspector"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 transition-colors"
                              onClick={() => deleteInspector(inspector.id)}
                            >
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
                        No se encontraron inspectores.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginación */}

            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6 flex justify-center">
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

        {/* Modal detalles */}

        {isModalOpen && selectedInspector && (
          <div className="fixed inset-0 bg-blue-200 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-600 rounded-lg shadow-xl max-w-2xl w-full p-8 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white hover:text-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Inspector
                  </h3>
                  <h2 className="text-2xl font-bold text-gray-200">
                    {selectedInspector?.nombres}
                  </h2>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Apellido
                  </h3>
                  <p className="text-4xl font-bold text-orange-500">
                    {selectedInspector?.apellidos}
                  </p>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-white mb-2">CUIL</h3>
                  <p className="text-gray-200">{selectedInspector?.cuil}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-medium text-white mb-2">
                    Número de nro_legajo
                  </h3>
                  <p className="text-gray-200">
                    {selectedInspector?.nro_legajo}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Formulario Nuevo Inspector */}

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
                  value={formData.nombres}
                  onChange={(e) =>
                    setFormData({ ...formData, nombres: e.target.value })
                  }
                  required
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={formData.apellidos}
                  onChange={(e) =>
                    setFormData({ ...formData, apellidos: e.target.value })
                  }
                  required
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
                  value={formData.nro_legajo}
                  onChange={(e) =>
                    setFormData({ ...formData, nro_legajo: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-400 transition-colors"
              >
               Crear +
              </button>
            </form>
          </div>
        )}

        {/* Formulario Editar Inspector */}
        
        {isEditModalOpen && inspectorToEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <form
              onSubmit={handleEditFormSubmit}
              className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg relative"
            >
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setInspectorToEdit(null);
                }}
                type="button"
                className="absolute top-4 right-4 text-gray-500 hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold mb-4 text-center">
                Editar Inspector
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editFormData.nombres}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, nombres: e.target.value })
                  }
                  required
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={editFormData.apellidos}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, apellidos: e.target.value })
                  }
                  required
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="CUIL"
                  value={editFormData.cuil}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, cuil: e.target.value })
                  }
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Número de Legajo"
                  value={editFormData.nro_legajo}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, nro_legajo: e.target.value })
                  }
                  className="border rounded p-2"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-400 transition-colors"
              >
                Actualizar
              </button>
            </form>
          </div>
        )}
      </>
    </LoaderContent>
  );
};

export default Inspectores;