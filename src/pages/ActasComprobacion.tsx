"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  ClipboardCheck,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  X,
  Edit,
  Trash2,
} from "lucide-react";
import ComprobacionData from "@/components/ComprobacionData";
import { LoaderContent } from "@/components/LoaderComponent";
import axios from "axios";
import { apiClient } from "@/services/authService";

// types

interface Acta {
  id: number;
  numero: string;
  propietarios: string;
  nJuzgado: string;
  creado: string;
  nombreFantasia: string;
  razonSocial: string;
  acta_comprobacion_nro?: string;
  fecha_acta_comprobacion?: string;
  hora_acta_comprobacion?: string;
  detalle_procedimiento?: string;
  procedimientos?: string[];
  domicilio_inspeccionado?: string;
  inspectores_id?: number[];
  observaciones?: string;
  // pdf_url?: string; //PDF
}

interface Inspector {
  id: number;
  nombres: string;
  identificador: string;
}

enum PROCEDIMIENTOS_ENUM {
  CLAUSURA8_INSECTOS = "CLAUSURA 8 INSECTOS",
  TOMADEMUESTRA = "TOMA DE MUESTRA",
  ACTADECOMPROBACION = "ACTA DE COMPROBACION",
  INTERVENCION_MERCADERIA_PRECINTADO = "INTERVENCION DE MERCADERIA Y PRECINTADO",
  SECUESTRO_PREVENTIVO = "SECUESTRO PREVENTIVO",
  CLAUSURA_PREVENTIVA = "CLAUSURA PREVENTIVA",
  OTROS = "OTROS",
}

const ActasComprobacion: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterType, setFilterType] = useState("Todos");
  const [filterValue, setFilterValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedActa, setSelectedActa] = useState<Acta | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actaToEdit, setActaToEdit] = useState<Acta | null>(null);

  const [deletedActaIds, setDeletedActaIds] = useState<Set<number>>(new Set());

  const itemsPerPage = 10;

  const [actas, setActas] = useState<Acta[]>([]);
  const [totalActas, setTotalActas] = useState(0);
  const [allInspectors, setAllInspectors] = useState<Inspector[]>([]);

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

  // const PROCEDIMIENTOS = [
  //   "CLAUSURA PREVENTIVA",
  //   "DECOMISO",
  //   "SECUESTRO",
  //   "INSPECCION",
  //   "OTROS",
  // ];

  const [formData, setFormData] = useState({
    acta_comprobacion_nro: "",
    fecha_acta_comprobacion: "",
    hora_acta_comprobacion: "",
    detalle_procedimiento: "",
    procedimientos: "" as string,
    domicilio_inspeccionado: "",
    inspectores_id: [] as number[],
    observaciones: "",
  });

  // const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null); //PDF

  const normalizeActaFromBackend = (raw: any): Acta => {
    return {
      id: raw.id,
      numero: raw.acta_comprobacion_nro ?? raw.numero ?? "",
      propietarios: raw.propietarios ?? "N/A",
      nJuzgado: raw.nro_juzgado ?? raw.nJuzgado ?? "N/A",
      creado: raw.fecha_acta_comprobacion ?? raw.creado ?? "",
      nombreFantasia: raw.nombreFantasia ?? "N/A",
      razonSocial: raw.razonSocial ?? "N/A",
      acta_comprobacion_nro: raw.acta_comprobacion_nro ?? "",
      fecha_acta_comprobacion: raw.fecha_acta_comprobacion ?? "",
      hora_acta_comprobacion: raw.hora_acta_comprobacion ?? "",
      detalle_procedimiento: raw.detalle_procedimiento ?? "",
      procedimientos: Array.isArray(raw.procedimientos)
        ? raw.procedimientos
        : [raw.procedimientos ?? ""],
      domicilio_inspeccionado: raw.domicilio_inspeccionado ?? "",
      inspectores_id: raw.inspectores_id ?? [],
      observaciones: raw.observaciones ?? "",
      // pdf_url: raw.pdf_url ?? "", //PDF
    };
  };

  // GET INSPECTORES

  const getAllInspectorForSelect = async () => {
    const { data } = await apiClient.get(`inspector/all-inspector`);
    setAllInspectors(data);
  };
  useEffect(() => {
    getAllInspectorForSelect();
  }, []);

  //LOADER

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // GET ACTAS

  const getActas = async (deletedId?: number) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API_URL}/acta-comprobacion?page=${currentPage}&size=${itemsPerPage}`
      );
      console.log("Respuesta del backend:", res.data);

      const payload = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.actas ?? res.data;

      const total = res.data.total ?? payload.length;
      console.log("Total de actas del backend:", total);
      setTotalActas(total);

      const normalized = payload.map(normalizeActaFromBackend);

      const filtered = normalized.filter((acta) => {
        const isInDeletedSet = deletedActaIds.has(acta.id);
        const isJustDeleted = deletedId !== undefined && acta.id === deletedId;
        return !isInDeletedSet && !isJustDeleted;
      });
      console.log(
        "Actas después de filtrar eliminadas localmente:",
        filtered.length
      );

      setActas(filtered);
    } catch (error) {
      console.error("Error al obtener actas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getActas();
  }, [currentPage]);

  const createActa = async (newActa: typeof formData) => {
    try {
      const payload = {
        acta_comprobacion: {
          acta_comprobacion_nro: newActa.acta_comprobacion_nro,
          fecha_acta_comprobacion: newActa.fecha_acta_comprobacion,
          hora_acta_comprobacion: newActa.hora_acta_comprobacion,
          detalle_procedimiento: newActa.detalle_procedimiento,
          procedimientos: newActa.procedimientos,
          domicilio_inspeccionado: newActa.domicilio_inspeccionado,
          observaciones: newActa.observaciones, // si la agregaste en el backend
          inspectores_id: newActa.inspectores_id,
        },
      };

      const res = await axios.post(`${API_URL}/acta-comprobacion`, payload);
      const createdRaw = res.data?.data ?? res.data;
      const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;

      const normalized = normalizeActaFromBackend(created);
      setActas((prev) => [...prev, normalized]);

      await getActas();
      alert("✅ Acta de Comprobación creada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al crear Acta:", error);
      alert(
        `Error al crear Acta: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // UPDATE

  const updateActa = async (id: number, updatedData: Partial<Acta>) => {
    try {
      const payload = {
        acta_comprobacion_nro: updatedData.acta_comprobacion_nro,
        fecha_acta_comprobacion: updatedData.fecha_acta_comprobacion,
        hora_acta_comprobacion: updatedData.hora_acta_comprobacion,
        detalle_procedimiento: updatedData.detalle_procedimiento,
        procedimientos: updatedData.procedimientos,
        domicilio_inspeccionado: updatedData.domicilio_inspeccionado,
        observaciones: updatedData.observaciones,
      };

      console.log("Actualizando acta ID:", id, "con payload:", payload);
      const res = await axios.patch(
        `${API_URL}/acta-comprobacion/${id}`,
        payload
      );
      console.log("✅ Acta actualizada:", res.data);

      await getActas();
      alert("✅ Acta actualizada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al actualizar acta:", error);
      alert(
        `Error al actualizar acta: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  // DELETE

  const deleteActa = async (id: number) => {
    if (!confirm("¿Está seguro de que desea eliminar esta acta?")) {
      return;
    }

    try {
      console.log("Iniciando eliminación de acta con ID:", id);
      console.log("URL completa:", `${API_URL}/acta-comprobacion/delete/${id}`);

      const response = await axios.get(
        `${API_URL}/acta-comprobacion/delete/${id}`
      );

      console.log("Respuesta del servidor:", response.data);
      console.log("Status code:", response.status);
      console.log("✅ Acta eliminada");

      setDeletedActaIds((prev) => new Set(prev).add(id));
      console.log("Acta marcada como eliminada localmente");

      await getActas(id);

      alert("✅ Acta eliminada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al eliminar acta:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.message);
      alert(
        `Error al eliminar acta: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const filteredActas = actas.filter((acta) => {
    if (!filterValue) return true;
    const value = filterValue.toLowerCase();
    switch (filterType) {
      case "Todos":
        return (
          acta.numero.toLowerCase().includes(value) ||
          acta.propietarios.toLowerCase().includes(value) ||
          acta.nombreFantasia.toLowerCase().includes(value) ||
          acta.razonSocial.toLowerCase().includes(value)
        );
      case "Numero":
        return acta.numero.toLowerCase().includes(value);
      case "Propietario":
        return acta.propietarios.toLowerCase().includes(value);
      case "Fantasia":
        return acta.nombreFantasia.toLowerCase().includes(value);
      case "Razon":
        return acta.razonSocial.toLowerCase().includes(value);
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(totalActas / itemsPerPage);

  const currentActas = filteredActas;

  console.log(
    "Total actas:",
    totalActas,
    "Total páginas:",
    totalPages,
    "Página actual:",
    currentPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleViewDetails = (acta: Acta) => {
    setSelectedActa(acta);
    setIsModalOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    // setSelectedPdfFile(null); //PDF
    setFormData({
      acta_comprobacion_nro: "",
      fecha_acta_comprobacion: "",
      hora_acta_comprobacion: "",
      detalle_procedimiento: "",
      procedimientos: "",
      domicilio_inspeccionado: "",
      inspectores_id: [],
      observaciones: "",
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createActa(formData);
    setFormData({
      acta_comprobacion_nro: "",
      fecha_acta_comprobacion: "",
      hora_acta_comprobacion: "",
      detalle_procedimiento: "",
      procedimientos: "",
      domicilio_inspeccionado: "",
      inspectores_id: [],
      observaciones: "",
    });
    setIsFormOpen(false);
  };

  const handleInspectorToggle = (inspectorId: number) => {
    setFormData((prev) => ({
      ...prev,
      inspectores_id: prev.inspectores_id.includes(inspectorId)
        ? prev.inspectores_id.filter((id) => id !== inspectorId)
        : [...prev.inspectores_id, inspectorId],
    }));
  };

  // QEPD PDF

  // const handlePdfFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (file && file.type === "application/pdf") {
  //     setSelectedPdfFile(file)
  //   } else {
  //     alert("Por favor seleccione un archivo PDF válido")
  //   }
  // }

  // EDITAR ACTAS

  const [editFormData, setEditFormData] = useState({
    acta_comprobacion_nro: "",
    fecha_acta_comprobacion: "",
    hora_acta_comprobacion: "",
    detalle_procedimiento: "",
    procedimientos: "" as string,
    domicilio_inspeccionado: "",
    observaciones: "",
  });
  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actaToEdit) {
      console.log("Enviando actualización con editFormData:", editFormData);
      await updateActa(actaToEdit.id, editFormData);
      setIsEditModalOpen(false);
      setActaToEdit(null);
    }
  };

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Actas..."
      minHeight="400px"
    >
      {/* HEADER */}

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm">
                 <div className="flex flex-col sm:flex-row justify-center items-center text-center sm:text-left gap-4">
            <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/30">
              <ClipboardCheck className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Actas de Comprobacion
            </h1>
          </div>
            </div>
          </div>

          {/* FILTROS */}

          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/50 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                >
                  <option value="Todos">Todos los campos</option>
                  <option value="Numero">N° de Acta</option>
                  <option value="Propietario">Propietario</option>
                  <option value="Fantasia">Nombre Fantasía</option>
                  <option value="Razon"> Razón Social</option>
                </select>

                <input
                  type="text"
                  placeholder="Buscar actas..."
                  value={filterValue}
                  onChange={(e) => {
                    setCurrentPage(1);
                    setFilterValue(e.target.value);
                  }}
                  className="flex-1 bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                />
              </div>

              {/* NUEVA ACTA + */}

              <button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-6 py-3 rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
              >
                <Plus className="w-5 h-5" />
                <span>Nueva Acta</span>
              </button>
            </div>
          </div>

          {/* TABLA */}

          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b-2 border-green-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Número
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Propietarios
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      N° Juzgado
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {currentActas.length > 0 ? (
                    currentActas.map((acta, index) => (
                      <tr
                        key={acta.id}
                        className={`${
                          index % 2 === 0
                            ? "bg-slate-800/30"
                            : "bg-slate-800/50"
                        } hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg`}
                      >
                        <td className="px-6 py-4 text-sm font-semibold text-white">
                          {acta.numero}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {acta.propietarios}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {acta.nJuzgado}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-300">
                          {acta.creado}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center space-x-2">
                            {/* BOTONES */}

                            <button
                              onClick={() => handleViewDetails(acta)}
                              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-cyan-500/30"
                              title="Ver detalles"
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() => {
                                setActaToEdit(acta);
                                const procedimientoValue = Array.isArray(
                                  acta.procedimientos
                                )
                                  ? acta.procedimientos[0] || ""
                                  : acta.procedimientos || "";

                                console.log(
                                  "Abriendo modal de edición para acta:",
                                  acta.id
                                );
                                console.log(
                                  "Procedimiento actual:",
                                  procedimientoValue
                                );

                                setEditFormData({
                                  acta_comprobacion_nro:
                                    acta.acta_comprobacion_nro || acta.numero,
                                  fecha_acta_comprobacion:
                                    acta.fecha_acta_comprobacion || acta.creado,
                                  hora_acta_comprobacion:
                                    acta.hora_acta_comprobacion || "",
                                  detalle_procedimiento:
                                    acta.detalle_procedimiento || "",
                                  procedimientos: procedimientoValue,
                                  domicilio_inspeccionado:
                                    acta.domicilio_inspeccionado || "",
                                  observaciones: acta.observaciones || "",
                                });
                                setIsEditModalOpen(true);
                              }}
                              className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-500/30"
                              title="Editar acta"
                            >
                              <Edit className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() => deleteActa(acta.id)}
                              className="text-red-500 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-500/30"
                              title="Eliminar acta"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center space-y-3">
                          <div className="text-6xl opacity-20">📋</div>
                          <p className="text-slate-400 text-lg font-medium">
                            No se encontraron resultados
                          </p>
                          <p className="text-slate-500 text-sm">
                            Intenta ajustar los filtros de búsqueda
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
                onClick={handlePreviousPage}
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
                onClick={handleNextPage}
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

      <ComprobacionData
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        acta={selectedActa}
      />

      {/* MODAL NUEVA ACTA */}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border-2 border-slate-700/50">
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-6 flex items-center justify-between border-b-2 border-emerald-500/30">
              <div className="flex items-center space-x-4">
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                  <ClipboardCheck className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold">
                  Nueva Acta de Comprobación
                </h2>
              </div>
              <button
                onClick={handleCloseForm}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* CAMPO 1. DATOS DEL ACTA */}

            <div className="overflow-y-auto flex-1 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <form className="space-y-6" onSubmit={handleFormSubmit}>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-cyan-400 mb-5 uppercase tracking-wide flex items-center space-x-2">
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                      1
                    </span>
                    <span>Datos del Acta</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        N° Acta de Comprobación
                      </label>
                      <input
                        type="text"
                        value={formData.acta_comprobacion_nro}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            acta_comprobacion_nro: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400 transition-all hover:bg-slate-700"
                        placeholder="Ej: AC-2024-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Fecha Acta
                      </label>
                      <input
                        type="date"
                        value={formData.fecha_acta_comprobacion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fecha_acta_comprobacion: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Hora
                      </label>
                      <input
                        type="time"
                        value={formData.hora_acta_comprobacion}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            hora_acta_comprobacion: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>

                {/* CAMPO 2. PROCEDIMIENTOS */}

                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-cyan-400 mb-5 uppercase tracking-wide flex items-center space-x-2">
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                      2
                    </span>
                    <span>Procedimiento</span>
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Tipo de Procedimiento
                      </label>
                      <select
                        value={formData.procedimientos}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            procedimientos: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all hover:bg-slate-700"
                      >
                        <option value="">Seleccione un procedimiento</option>
                        {Object.entries(PROCEDIMIENTOS_ENUM).map(
                          ([key, label]) => (
                            <option key={key} value={label}>
                              {label}
                            </option>
                          )
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Detalle del Procedimiento
                      </label>
                      <textarea
                        maxLength={700}
                        rows={4}
                        value={formData.detalle_procedimiento}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            detalle_procedimiento: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400 transition-all hover:bg-slate-700"
                        placeholder="Describa detalladamente el procedimiento realizado..."
                      />
                    </div>
                  </div>
                </div>

                {/* CAMPO 3. DOMICILIO */}

                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-cyan-400 mb-5 uppercase tracking-wide flex items-center space-x-2">
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                      3
                    </span>
                    <span>Domicilio Inspeccionado</span>
                  </h3>
                  <input
                    type="text"
                    value={formData.domicilio_inspeccionado}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        domicilio_inspeccionado: e.target.value,
                      })
                    }
                    required
                    placeholder="Calle, número, localidad..."
                    className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400 transition-all hover:bg-slate-700"
                  />
                </div>

                {/* CAMPO 4. INSPECTORES */}

                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-cyan-400 mb-5 uppercase tracking-wide flex items-center space-x-2">
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                      4
                    </span>
                    <span>Inspectores</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {allInspectors.length > 0 ? (
                      allInspectors.map((inspector) => (
                        <label
                          key={inspector.id}
                          className="flex items-center space-x-3 p-3 hover:bg-slate-700/50 rounded-xl cursor-pointer transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                        >
                          <input
                            type="checkbox"
                            checked={formData.inspectores_id.includes(
                              inspector.id
                            )}
                            onChange={() => handleInspectorToggle(inspector.id)}
                            className="accent-cyan-500 w-5 h-5 rounded"
                          />
                          <span className="text-sm text-slate-300 font-medium">
                            {inspector.nombres}{" "}
                            <span className="text-slate-500">
                              • Legajo: {inspector.identificador}
                            </span>
                          </span>
                        </label>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic col-span-2 text-center py-4">
                        No hay inspectores disponibles
                      </p>
                    )}
                  </div>
                </div>

                {/* CAMPO 5. DOCUMENTACION */}

                <div className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-xl border border-slate-700/30 shadow-xl opacity-60">
                  <h3 className="text-lg font-bold text-slate-400 mb-5 uppercase tracking-wide flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="bg-slate-700/50 px-3 py-1 rounded-lg border border-slate-600/30">
                        5
                      </span>
                      <span>Documentación</span>
                    </div>
                    <span className="text-xs font-normal text-slate-500 bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-600/30">
                      Próximamente
                    </span>
                  </h3>
                  <div>
                    <label className="block text-sm font-semibold text-slate-400 mb-3">
                      PDF del Acta
                    </label>
                    <div className="border-2 border-dashed border-slate-700/50 rounded-xl p-8 text-center bg-slate-800/30 cursor-not-allowed">
                      <div className="text-5xl mb-3 opacity-30">📄</div>
                      <div className="text-sm text-slate-500 font-medium">
                        Funcionalidad de carga de PDF deshabilitada
                      </div>
                      <div className="text-xs text-slate-600 mt-2">
                        Esta función estará disponible próximamente
                      </div>
                    </div>
                  </div>
                </div>

                {/* CAMPO 6. OBSERVACIONES */}

                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-cyan-400 mb-5 uppercase tracking-wide flex items-center space-x-2">
                    <span className="bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/30">
                      6
                    </span>
                    <span>Observaciones</span>
                  </h3>
                  <textarea
                    maxLength={700}
                    rows={6}
                    value={formData.observaciones}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        observaciones: e.target.value,
                      })
                    }
                    className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder-slate-400 transition-all hover:bg-slate-700"
                    placeholder="Agregue cualquier observación adicional relevante..."
                  />
                  <div className="text-xs text-slate-400 mt-2 text-right font-medium">
                    {formData.observaciones.length}/700 caracteres
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t-2 border-slate-700/50">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="bg-slate-700 text-white px-8 py-3 rounded-xl hover:bg-slate-600 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleFormSubmit}
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-xl hover:shadow-emerald-500/50 hover:scale-105 font-semibold"
                  >
                    Guardar Acta
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* EDITAR ACTA */}

      {isEditModalOpen && actaToEdit && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col border-2 border-slate-700/50">
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-6 flex items-center justify-between border-b-2 border-amber-500/30">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/30">
                  <ClipboardCheck className="w-8 h-8 text-amber-400" />
                </div>
                <h2 className="text-2xl font-bold">
                  Editar Acta de Comprobación
                </h2>
              </div>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setActaToEdit(null);
                }}
                className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-xl transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
              <form className="space-y-6" onSubmit={handleEditFormSubmit}>
                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-amber-400 mb-5 uppercase tracking-wide">
                    Datos del Acta
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        N° Acta
                      </label>
                      <input
                        type="text"
                        value={editFormData.acta_comprobacion_nro}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            acta_comprobacion_nro: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all hover:bg-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={editFormData.fecha_acta_comprobacion}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            fecha_acta_comprobacion: e.target.value,
                          })
                        }
                        required
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all hover:bg-slate-700"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Hora
                      </label>
                      <input
                        type="time"
                        value={editFormData.hora_acta_comprobacion}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            hora_acta_comprobacion: e.target.value,
                          })
                        }
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all hover:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-amber-400 mb-5 uppercase tracking-wide">
                    Procedimiento
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Tipo
                      </label>
                      <select
                        value={editFormData.procedimientos}
                        onChange={(e) => {
                          console.log(
                            "Cambiando procedimiento a:",
                            e.target.value
                          );
                          setEditFormData({
                            ...editFormData,
                            procedimientos: e.target.value,
                          });
                        }}
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all hover:bg-slate-700"
                      >
                        <option value="">Seleccione</option>
                        {Object.values(PROCEDIMIENTOS_ENUM).map((proc) => (
                          <option key={proc} value={proc}>
                            {proc}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-300 mb-2">
                        Detalle
                      </label>
                      <textarea
                        maxLength={700}
                        rows={4}
                        value={editFormData.detalle_procedimiento}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            detalle_procedimiento: e.target.value,
                          })
                        }
                        className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400 transition-all hover:bg-slate-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-amber-400 mb-5 uppercase tracking-wide">
                    Domicilio
                  </h3>
                  <input
                    type="text"
                    value={editFormData.domicilio_inspeccionado}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        domicilio_inspeccionado: e.target.value,
                      })
                    }
                    className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400 transition-all hover:bg-slate-700"
                  />
                </div>

                <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50 shadow-xl">
                  <h3 className="text-lg font-bold text-amber-400 mb-5 uppercase tracking-wide">
                    Observaciones
                  </h3>
                  <textarea
                    maxLength={700}
                    rows={6}
                    value={editFormData.observaciones}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        observaciones: e.target.value,
                      })
                    }
                    className="w-full bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-slate-400 transition-all hover:bg-slate-700"
                    placeholder="Escriba sus observaciones aquí..."
                  />
                  <div className="text-xs text-slate-400 mt-2 text-right font-medium">
                    {editFormData.observaciones.length}/700 caracteres
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t-2 border-slate-700/50">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setActaToEdit(null);
                    }}
                    className="bg-slate-700 text-white px-8 py-3 rounded-xl hover:bg-slate-600 transition-all duration-200 font-semibold shadow-lg"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-xl hover:from-emerald-500 hover:to-emerald-400 transition-all duration-300 shadow-xl hover:shadow-emerald-500/50 hover:scale-105 font-semibold"
                  >
                    Actualizar Acta
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </LoaderContent>
  );
};

export default ActasComprobacion;
