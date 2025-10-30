import type React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  UserCheck,
  Eye,
  Plus,
  X,
  Edit,
  ShieldBan,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent";

// Campos

interface Inspector {
  id: number; // quitarlo?
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
  const [filterValue, setFilterValue] = useState("");
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inspectores, setInspectores] = useState<Inspector[]>([]);
  const [inspectorToEdit, setInspectorToEdit] = useState<Inspector | null>(
    null
  );

  // Loader
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
        funcion: FUNCION_INSPECTOR.CONTROL_MD,
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
      alert(
        `Error al crear inspector: ${
          error.response?.data?.message || error.message
        }`
      );
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
      alert(
        `Error al actualizar inspector: ${
          error.response?.data?.message || error.message
        }`
      );
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
      await axios.get(`${API_URL}/inspector/delete/${id}`, {
        data: { activo: "false" },
      });
      console.log("✅ Inspector desactivado");

      // Recargar la lista después de desactivar

      await getInspectores();

      alert("✅ Inspector desactivado exitosamente");
    } catch (error: any) {
      console.error("❌ Error al desactivar inspector:", error);
      console.error("❌ Respuesta del error:", error.response?.data);
      alert(
        `Error al desactivar inspector: ${
          error.response?.data?.message || error.message
        }`
      );
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
        if (filterType === "nro_legajo")
          return (inspector.nro_legajo ?? "").includes(searchTerm);
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
        <div className="bg-slate-900 p-6 rounded-lg">
          {/* Titulo */}

          <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8 rounded-lg">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm">
                  <div className="flex flex-col sm:flex-row justify-center items-center text-center sm:text-left gap-4">
                    <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/30">
                      <UserCheck className="w-8 h-8 sm:w-10 sm:h-10 text-blue-500" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                      Inspectores
                    </h1>
                  </div>
                </div>
              </div>
            </div>

            {/* Filtros + boton nuevo inspector */}

            <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                  <select
                    value={filterType}
                    onChange={(e) => {
                      setFilterType(e.target.value);
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    className="bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                  >
                    <option value="">Filtros</option>
                    <option value="apellido">Apellido</option>
                    <option value="nro_legajo">Nro.Legajo</option>
                  </select>

                  {filterType && (
                    <input
                      type="text"
                      placeholder={`Buscar por ${filterType}...`}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                    />
                  )}
                </div>

                {/*   BOTON NUEVO INSPECTOR + */}

                <button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-gradient-to-r from-cyan-600 to-cyan-400 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-blue-400 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
                >
                  <Plus className="w-5 h-5" />
                  <span>Nueva Inspector</span>
                </button>
              </div>
            </div>

            {/* Tabla */}

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b-2 border-cyan-500">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nombre
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Apellido
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Activo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Funcion
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Nro. Legajo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Detalles
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {currentInspectores.length > 0 ? (
                      currentInspectores.map((inspector, index) => (
                        <tr
                          key={inspector.id}
                          className={`${
                            index % 2 === 0
                              ? "bg-slate-800/30"
                              : "bg-slate-800/50"
                          } hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg`}
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-white">
                            {inspector.id}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-300">
                            {inspector.nombres}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-300">
                            {inspector.apellidos}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-300">
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

                          <td className="px-6 py-4 text-sm text-slate-300">
                            {inspector.funcion}
                          </td>

                          <td className="px-6 py-4 text-sm text-slate-300">
                            {inspector?.nro_legajo || inspector?.cuil}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewDetails(inspector)}
                                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-cyan-500/30"
                                title="Ver detalles"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-500/30"
                                onClick={() => handleEditClick(inspector)}
                                title="Editar inspector"
                              >
                                <Edit className="w-5 h-5" />
                              </button>

                              <button
                                className="text-red-500 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-500/30"
                                onClick={() => deleteInspector(inspector.id)}
                              >
                                <ShieldBan className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-3">
                            <div className="text-6xl opacity-20">📋</div>
                            <p className="text-slate-400 text-lg font-medium">
                              No se encontraron resultados
                            </p>
                            <p className="text-slate-500 text-sm">
                              Intenta ajustar los filtros de busqueda
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINACION */}

              <div className="bg-slate-800/80 px-6 py-5 flex items-center justify-center space-x-4 border-t border-slate-700/50">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1 || totalPages === 0}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === 1 || totalPages === 0
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      : "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600 hover:scale-105 shadow-lg"
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="bg-slate-700/50 px-6 py-3 rounded-xl border border-slate-600/50">
                  <span className="text-sm font-semibold text-slate-200">
                    Página{" "}
                    <span className="text-white">
                      {totalPages === 0 ? 0 : currentPage}
                    </span>{" "}
                    de <span className="text-white">{totalPages}</span>
                  </span>
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-cyan-500 text-white hover:from-cyan-500 hover:to-cyan-400 hover:scale-105"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal detalles */}

        {isModalOpen && selectedInspector && (
          <div className="fixed inset-0 bg-cyan-200/30 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
              className="bg-slate-800 rounded-lg p-6 w-full max-w-lg shadow-lg relative"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                type="button"
                className="absolute top-4 right-4 text-white hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-white text-xl font-bold mb-4 text-center">
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
                className="mt-4 w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition-colors"
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
              className="bg-slate-800 rounded-lg p-6 w-full max-w-lg shadow-lg relative"
            >
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setInspectorToEdit(null);
                }}
                type="button"
                className="absolute top-4 right-4 text-white hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-white text-xl font-bold mb-4 text-center">
                Editar Inspector
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editFormData.nombres}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      nombres: e.target.value,
                    })
                  }
                  required
                  className="border rounded p-2"
                />
                <input
                  type="text"
                  placeholder="Apellido"
                  value={editFormData.apellidos}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      apellidos: e.target.value,
                    })
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
                    setEditFormData({
                      ...editFormData,
                      nro_legajo: e.target.value,
                    })
                  }
                  className="border rounded p-2"
                />
              </div>

              <button
                type="submit"
                className="mt-4 w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 transition-colors"
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
