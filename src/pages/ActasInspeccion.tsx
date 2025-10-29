"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Plus,
  X,
  FileText,
  Edit,
  Trash2,
} from "lucide-react";
import InspeccionesData from "../components/InspeccionesData";
import { LoaderContent } from "@/components/LoaderComponent";
import axios from "axios";

interface ActaInspeccion {
  id: number;
  numero: string;
  denuncia: string;
  fecha: string;
  turno: string;
  cargado: string;
  numeroNotificacion: string;
  razonSocial: string;
  fantasia: string;
  // adicionales
  nombre_razon_social?: string;
  cuit_cuil?: string;
  habilitacion_municipal?: string;
  fecha_constancia?: string;
  domicilio_declarado?: string;
  actividad_habilitada?: string;
  no_permite_inspeccion?: boolean;
  nombre_apellido_recibe?: string;
  dni_recibe?: string;
  cargo_funcion?: string;
  coincide_domicilio?: string;
  domicilio_efectivo?: string;
  actividad_desarrollada?: string;
  condiciones_higiene?: string[];
  elementos_seguridad?: string[];
  estado_agua?: string;
  lugar_deposito_residuos?: string;
  observaciones_agua?: string;
  muebles_materiales?: string;
  manejo?: string;
  estado?: string;
  certificacion_desinfeccion?: string;
  certificacion_exhibe?: string;
  observaciones_generales?: string;
}

enum CONDICION_ENUM {
  BUENA = "BUENA",
  MALA = "MALA",
}

enum CONFIRMACION_ENUM {
  SI = "SI",
  NO = "NO",
  ENTRAMITE = "ENTRAMITE",
}

const ActasInspeccion: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActa, setSelectedActa] = useState<ActaInspeccion | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [filterType, setFilterType] = useState("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterValue, setFilterValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterField, setFilterField] = useState("Todos");
  const [filterTurno, setFilterTurno] = useState("Todos");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actaToEdit, setActaToEdit] = useState<ActaInspeccion | null>(null);
  const itemsPerPage = 10;

  const [actas, setActas] = useState<ActaInspeccion[]>([]);
  const [totalActas, setTotalActas] = useState(0);

  const API_URL =
    typeof window !== "undefined" && (window as any).VITE_API_URL
      ? (window as any).VITE_API_URL
      : "http://localhost:4000/api/v1";

  const [formData, setFormData] = useState({
    nombre_razon_social: "",
    cuit_cuil: "",
    habilitacion_municipal: "",
    fecha_constancia: "",
    domicilio_declarado: "",
    actividad_habilitada: "",
    no_permite_inspeccion: false,
    nombre_apellido_recibe: "",
    dni_recibe: "",
    cargo_funcion: "",
    coincide_domicilio: "",
    domicilio_efectivo: "",
    actividad_desarrollada: "",
    condiciones_higiene: [] as string[],
    elementos_seguridad: [] as string[],
    estado_agua: "",
    lugar_deposito_residuos: "",
    observaciones_agua: "",
    muebles_materiales: "",
    manejo: "",
    estado: "",
    certificacion_desinfeccion: "",
    certificacion_exhibe: "",
    observaciones_generales: "",
  });

  const [editFormData, setEditFormData] = useState({
    nombre_razon_social: "",
    cuit_cuil: "",
    habilitacion_municipal: "",
    fecha_constancia: "",
    domicilio_declarado: "",
    actividad_habilitada: "",
    no_permite_inspeccion: false,
    nombre_apellido_recibe: "",
    dni_recibe: "",
    cargo_funcion: "",
    coincide_domicilio: "",
    domicilio_efectivo: "",
    actividad_desarrollada: "",
    condiciones_higiene: [] as string[],
    elementos_seguridad: [] as string[],
    estado_agua: "",
    lugar_deposito_residuos: "",
    observaciones_agua: "",
    muebles_materiales: "",
    manejo: "",
    estado: "",
    certificacion_desinfeccion: "",
    certificacion_exhibe: "",
    observaciones_generales: "",
  });

  // NORMALIZACION

  const normalizeActaFromBackend = (raw: any): ActaInspeccion => {
    return {
      id: raw.id,
      numero: raw.numero ?? `AI-${raw.id}`,
      denuncia: raw.denuncia ?? "-",
      fecha: raw.fecha ?? raw.fecha_constancia ?? "",
      turno: raw.turno ?? "N/A",
      cargado: raw.cargado ?? "Pendiente",
      numeroNotificacion: raw.numeroNotificacion ?? "Pendiente",
      razonSocial: raw.razonSocial ?? raw.nombre_razon_social ?? "N/A",
      fantasia: raw.fantasia ?? "N/A",
      ...raw,
    };
  };

  // GET ACTAS

  const getActas = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        `${API_URL}/acta-inspeccion?page=${currentPage}`
      );
      console.log("Respuesta del backend:", res.data);

      const payload = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? res.data?.actas ?? res.data;

      const total = res.data.total ?? payload.length;
      setTotalActas(total);

      const normalized = payload.map(normalizeActaFromBackend);
      setActas(normalized);
    } catch (error) {
      console.error("Error al obtener actas:", error);
      // Fallback to empty array if API fails
      setActas([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getActas();
  }, [currentPage]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // CREATE

  const createActa = async (newActa: typeof formData) => {
    try {
      const payload = {
        acta_inspeccion: newActa,
      };

      const res = await axios.post(`${API_URL}/acta-inspeccion`, payload);
      const createdRaw = res.data?.data ?? res.data;
      const created = Array.isArray(createdRaw) ? createdRaw[0] : createdRaw;

      const normalized = normalizeActaFromBackend(created);
      setActas((prev) => [...prev, normalized]);

      await getActas();
      alert("✅ Acta de Inspección creada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al crear Acta:", error);
      alert(
        `Error al crear Acta: ${error.response?.data?.message || error.message}`
      );
    }
  };

  // UPDATE

  const updateActa = async (
    id: number,
    updatedData: Partial<ActaInspeccion>
  ) => {
    try {
      const payload = updatedData;

      console.log("Actualizando acta ID:", id, "con payload:", payload);
      const res = await axios.patch(
        `${API_URL}/acta-inspeccion/${id}`,
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
      console.log("Eliminando acta:", id);
      await axios.get(`${API_URL}/acta-inspeccion/delete/${id}`);
      console.log("✅ Acta eliminada");

      await getActas();
      alert("✅ Acta eliminada exitosamente");
    } catch (error: any) {
      console.error("❌ Error al eliminar acta:", error);
      alert(
        `Error al eliminar acta: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  const filteredActas = actas.filter((acta) => {
    const term = searchTerm.toLowerCase();
    if (filterTurno !== "Todos" && acta.turno !== filterTurno) return false;
    if (!term.trim()) return true;
    switch (filterField) {
      case "Todos":
        return (
          acta.numero.toLowerCase().includes(term) ||
          acta.turno.toLowerCase().includes(term) ||
          acta.numeroNotificacion.toLowerCase().includes(term) ||
          acta.cargado.toLowerCase().includes(term) ||
          acta.razonSocial.toLowerCase().includes(term) ||
          acta.fantasia.toLowerCase().includes(term)
        );
      case "Numero":
        return acta.numero.toLowerCase().includes(term);
      case "Notificacion":
        return acta.numeroNotificacion.toLowerCase().includes(term);
      case "RazonSocial":
        return acta.razonSocial.toLowerCase().includes(term);
      case "Fantasia":
        return acta.fantasia.toLowerCase().includes(term);
      default:
        return true;
    }
  });

  const totalPages = Math.ceil(filteredActas.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActas = filteredActas.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData({
      nombre_razon_social: "",
      cuit_cuil: "",
      habilitacion_municipal: "",
      fecha_constancia: "",
      domicilio_declarado: "",
      actividad_habilitada: "",
      no_permite_inspeccion: false,
      nombre_apellido_recibe: "",
      dni_recibe: "",
      cargo_funcion: "",
      coincide_domicilio: "",
      domicilio_efectivo: "",
      actividad_desarrollada: "",
      condiciones_higiene: [],
      elementos_seguridad: [],
      estado_agua: "",
      lugar_deposito_residuos: "",
      observaciones_agua: "",
      muebles_materiales: "",
      manejo: "",
      estado: "",
      certificacion_desinfeccion: "",
      certificacion_exhibe: "",
      observaciones_generales: "",
    });
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createActa(formData);
    handleCloseForm();
  };

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (actaToEdit) {
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
      {/* TITULO */}
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm">
              <div className="flex justify-center items-center space-x-4">
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/30">
                  <Search className="w-10 h-10 text-cyan-400" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Actas de Inscripcion
                </h1>
              </div>
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

            {/* CREAR ACTA */}

            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl hover:from-blue-400 hover:to-blue-400 transition-all duration-300 flex items-center justify-center space-x-2 font-semibold"
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
              <thead className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b-2 border-blue-500">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Número de Acta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Denuncia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Turno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Razón Social
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Fantasia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Cargado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Notificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase">
                    Opciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {currentActas.length > 0 ? (
                  currentActas.map((acta, index) => (
                    <tr
                      key={acta.id}
                      className={`${
                        index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                      } hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-white">
                        {acta.numero}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-300">{}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center space-x-2">
                          {/* BOTONES */}

                          <button
                            // onClick={() => handleViewDetails(acta)}
                            className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-cyan-500/30"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => {
                              setActaToEdit(acta);
                              // const procedimientoValue = Array.isArray(
                              //   acta.procedimientos
                              // )
                              //   ? acta.procedimientos[0] || ""
                              //   : acta.procedimientos || "";

                              console.log(
                                "Abriendo modal de edición para acta:",
                                acta.id
                              );
                              // console.log(
                              //   "Procedimiento actual:",
                              //   procedimientoValue
                              // );

                              // setEditFormData({
                              //   acta_comprobacion_nro:
                              //     acta.acta_comprobacion_nro || acta.numero,
                              //   fecha_acta_comprobacion:
                              //     acta.fecha_acta_comprobacion || acta.creado,
                              //   hora_acta_comprobacion:
                              //     acta.hora_acta_comprobacion || "",
                              //   detalle_procedimiento:
                              //     acta.detalle_procedimiento || "",
                              //   procedimientos: procedimientoValue,
                              //   domicilio_inspeccionado:
                              //     acta.domicilio_inspeccionado || "",
                              //   observaciones: acta.observaciones || "",
                              // });
                              setIsEditModalOpen(true);
                            }}
                            className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-500/30"
                            title="Editar acta"
                          >
                            <Edit className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => deleteActa(acta.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-red-500/30"
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
                    <td
                      colSpan={9}
                      className="text-center py-4 text-gray-500 italic"
                    >
                      No se encontraron resultados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {selectedActa && (
            <InspeccionesData
              actaData={selectedActa}
              onClose={() => setSelectedActa(null)}
            />
          )}

          {isFormOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-slate-700 text-white p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <h2 className="text-2xl font-bold">
                      Nueva Acta de Inspección
                    </h2>
                  </div>
                  <button
                    onClick={handleCloseForm}
                    className="text-white hover:text-red-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* FORM ESCROLEABLE*/}
                <div className="overflow-y-auto flex-1 p-6 bg-slate-500">
                  <form className="space-y-6" onSubmit={handleFormSubmit}>
                    {/* Sección 1: DATOS DE LA PERSONA HUMANA O JURÍDICA A INSPECCIONAR */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        1. Datos de la Persona Humana o Jurídica a Inspeccionar
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nombre o razón social"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.nombre_razon_social}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nombre_razon_social: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="CUIT/CUIL"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.cuit_cuil}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cuit_cuil: e.target.value,
                            })
                          }
                        />

                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-700">
                            Habilitación Municipal:
                          </span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="habilitacion"
                              value="si"
                              className="accent-blue-500"
                              checked={formData.habilitacion_municipal === "si"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  habilitacion_municipal: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">Sí</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="habilitacion"
                              value="no"
                              className="accent-red-600"
                              checked={formData.habilitacion_municipal === "no"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  habilitacion_municipal: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="habilitacion"
                              value="tramite"
                              className="accent-orange-500"
                              checked={
                                formData.habilitacion_municipal === "tramite"
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  habilitacion_municipal: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">En trámite</span>
                          </label>
                        </div>

                        <input
                          type="date"
                          placeholder="Fecha constancia"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.fecha_constancia}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              fecha_constancia: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Domicilio declarado"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.domicilio_declarado}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              domicilio_declarado: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Actividad habilitada"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.actividad_habilitada}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              actividad_habilitada: e.target.value,
                            })
                          }
                        />

                        <label className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            className="mt-1 accent-blue-500"
                            checked={formData.no_permite_inspeccion}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                no_permite_inspeccion: e.target.checked,
                              })
                            }
                          />
                          <span className="text-xs text-gray-600">
                            No se permite la realización de la inspección. En
                            virtud de ello se procede a fijar el acta notificada
                            en la puerta del inmueble, según lo establecido por
                            el artículo 210° C.P.A.M. y se remite a J.F.M. en
                            los términos del artículo 210° C.M.I.
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Sección 2: DATOS PERSONALES DE LA PERSONA HUMANA QUE NOS RECIBE LA INSPECCIÓN */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        2. Datos Personales de la Persona Humana que nos Recibe
                        la Inspección
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nombre y apellido"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.nombre_apellido_recibe}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nombre_apellido_recibe: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="D.N.I."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.dni_recibe}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              dni_recibe: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Cargo/función"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.cargo_funcion}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              cargo_funcion: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Sección 3: INSPECCIÓN */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        3. Inspección
                      </h3>

                      {/* a. Coincide el domicilio */}

                      <div className="mb-4">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            a. ¿Coincide el domicilio declarado con el domicilio
                            efectivo e inspeccionado?
                          </span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="domicilio"
                              value="si"
                              className="accent-blue-600"
                              checked={formData.coincide_domicilio === "si"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  coincide_domicilio: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">Sí</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="domicilio"
                              value="no"
                              className="accent-red-600"
                              checked={formData.coincide_domicilio === "no"}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  coincide_domicilio: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="En caso negativo, domicilio efectivo e inspeccionado"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.domicilio_efectivo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              domicilio_efectivo: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* b. Actividad efectivamente desarrollada */}

                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                          b. Actividad efectivamente desarrollada:
                        </label>
                        <textarea
                          placeholder="Describa la actividad..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                          value={formData.actividad_desarrollada}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              actividad_desarrollada: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* c. Condiciones de higiene en general */}

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            c. Condiciones de higiene en general
                          </h4>
                          <div className="space-y-2">
                            {[
                              { id: "higiene-1", label: "Orden y limpieza" },
                              { id: "higiene-2", label: "Baños" },
                              {
                                id: "higiene-3",
                                label: "Cantidad de baños completos y retrete",
                              },
                              { id: "higiene-4", label: "Cantidad de baños" },
                              {
                                id: "higiene-5",
                                label: "Cantidad de baños completos",
                              },
                              {
                                id: "higiene-6",
                                label: "Cantidad de baños con retrete",
                              },
                            ].map((item) => (
                              <label
                                key={item.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={formData.condiciones_higiene.includes(
                                    item.label
                                  )}
                                  onChange={(e) => {
                                    const newHigiene = e.target.checked
                                      ? [
                                          ...formData.condiciones_higiene,
                                          item.label,
                                        ]
                                      : formData.condiciones_higiene.filter(
                                          (h) => h !== item.label
                                        );
                                    setFormData({
                                      ...formData,
                                      condiciones_higiene: newHigiene,
                                    });
                                  }}
                                />
                                <span className="text-sm">{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Complemento de elementos de seguridad
                          </h4>
                          <div className="space-y-2">
                            {[
                              {
                                id: "seguridad-1",
                                label:
                                  "¿Posee botiquín de primeros auxilios con los elementos mínimos?",
                              },
                              {
                                id: "seguridad-2",
                                label: "Matafuego (varios)",
                              },
                              {
                                id: "seguridad-3",
                                label: "¿Están en vigencia los matafuegos?",
                              },
                              {
                                id: "seguridad-4",
                                label: "Tipos de matafuegos",
                              },
                              {
                                id: "seguridad-5",
                                label: "¿Los matafuegos tienen señalizacion?",
                              },
                              {
                                id: "seguridad-6",
                                label:
                                  "¿Posee salida de emergencia bien señalizada?",
                              },
                            ].map((item) => (
                              <label
                                key={item.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={formData.elementos_seguridad.includes(
                                    item.label
                                  )}
                                  onChange={(e) => {
                                    const newSeguridad = e.target.checked
                                      ? [
                                          ...formData.elementos_seguridad,
                                          item.label,
                                        ]
                                      : formData.elementos_seguridad.filter(
                                          (s) => s !== item.label
                                        );
                                    setFormData({
                                      ...formData,
                                      elementos_seguridad: newSeguridad,
                                    });
                                  }}
                                />
                                <span className="text-sm">{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* d. Condiciones de agua */}

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          d. Condiciones de agua
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm">Estado:</span>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="agua-estado"
                                value="potable"
                                className="accent-blue-600"
                                checked={formData.estado_agua === "potable"}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    estado_agua: e.target.value,
                                  })
                                }
                              />
                              <span className="text-sm">Potable</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="agua-estado"
                                value="no-potable"
                                className="accent-red-600"
                                checked={formData.estado_agua === "no-potable"}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    estado_agua: e.target.value,
                                  })
                                }
                              />
                              <span className="text-sm">No potable</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            placeholder="Lugar de depósito de residuos para desalojo"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={formData.lugar_deposito_residuos}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                lugar_deposito_residuos: e.target.value,
                              })
                            }
                          />
                          <textarea
                            placeholder="Observaciones..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-16 resize-none"
                            value={formData.observaciones_agua}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                observaciones_agua: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Muebles de materiales, Manejo, Estado */}

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Muebles de materiales"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.muebles_materiales}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              muebles_materiales: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Manejo"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.manejo}
                          onChange={(e) =>
                            setFormData({ ...formData, manejo: e.target.value })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Estado"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={formData.estado}
                          onChange={(e) =>
                            setFormData({ ...formData, estado: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    {/* Sección 4: DEBERES FORMALES */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        4. Deberes Formales
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-normal text-gray-700">
                          Certificación de desinfección (ordenanza N° 2819):
                        </span>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion"
                            value="si"
                            className="accent-blue-600"
                            checked={
                              formData.certificacion_desinfeccion === "si"
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                certificacion_desinfeccion: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">Sí</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion"
                            value="no"
                            className="accent-red-600"
                            checked={
                              formData.certificacion_desinfeccion === "no"
                            }
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                certificacion_desinfeccion: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">No</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion-exhibe"
                            value="si"
                            className="accent-blue-600"
                            checked={formData.certificacion_exhibe === "si"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                certificacion_exhibe: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">
                            En caso afirmativo, exhibe: Sí
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion-exhibe"
                            value="no"
                            className="accent-blue-600"
                            checked={formData.certificacion_exhibe === "no"}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                certificacion_exhibe: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Sección 5: OBSERVACIONES Y DESCRIPCIÓN GENERAL */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        5. Observaciones y Descripción General
                      </h3>
                      <textarea
                        maxLength={800}
                        placeholder="Escriba sus observaciones generales aquí..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-32 resize-none"
                        value={formData.observaciones_generales}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            observaciones_generales: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* BOTONES DE OPCIONES */}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={handleCloseForm}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-5"
                      >
                        Guardar Acta de Inspección
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* MODAL PARA EDITAR */}
          {isEditModalOpen && actaToEdit && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}

                <div className="bg-slate-700 text-white p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-8 h-8 text-blue-500" />
                    <h2 className="text-2xl font-bold">
                      Editar Acta de Inspección #{actaToEdit.id}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setActaToEdit(null);
                    }}
                    className="text-white hover:text-red-500 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="overflow-y-auto flex-1 p-6 bg-slate-500">
                  <form className="space-y-6" onSubmit={handleEditFormSubmit}>
                    {/* Sección 1: DATOS DE LA PERSONA HUMANA O JURÍDICA A INSPECCIONAR */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        1. Datos de la Persona Humana o Jurídica a Inspeccionar
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nombre o razón social"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.nombre_razon_social}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              nombre_razon_social: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="CUIT/CUIL"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.cuit_cuil}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              cuit_cuil: e.target.value,
                            })
                          }
                        />

                        <div className="flex items-center space-x-4">
                          <span className="text-sm font-medium text-gray-700">
                            Habilitación Municipal:
                          </span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="habilitacion-edit"
                              value="si"
                              className="accent-blue-500"
                              checked={
                                editFormData.habilitacion_municipal === "si"
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  habilitacion_municipal: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">Sí</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="habilitacion-edit"
                              value="no"
                              className="accent-red-600"
                              checked={
                                editFormData.habilitacion_municipal === "no"
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  habilitacion_municipal: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">No</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="habilitacion-edit"
                              value="tramite"
                              className="accent-orange-500"
                              checked={
                                editFormData.habilitacion_municipal ===
                                "tramite"
                              }
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  habilitacion_municipal: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">En trámite</span>
                          </label>
                        </div>

                        <input
                          type="date"
                          placeholder="Fecha constancia"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.fecha_constancia}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              fecha_constancia: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Domicilio declarado"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.domicilio_declarado}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              domicilio_declarado: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Actividad habilitada"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.actividad_habilitada}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              actividad_habilitada: e.target.value,
                            })
                          }
                        />

                        <label className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            className="mt-1 accent-blue-500"
                            checked={editFormData.no_permite_inspeccion}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                no_permite_inspeccion: e.target.checked,
                              })
                            }
                          />
                          <span className="text-xs text-gray-600">
                            No se permite la realización de la inspección. En
                            virtud de ello se procede a fijar el acta notificada
                            en la puerta del inmueble, según lo establecido por
                            el artículo 210° C.P.A.M. y se remite a J.F.M. en
                            los términos del artículo 210° C.M.I.
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* Sección 2: DATOS PERSONALES DE LA PERSONA HUMANA QUE NOS RECIBE LA INSPECCIÓN */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        2. Datos Personales de la Persona Humana que nos Recibe
                        la Inspección
                      </h3>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Nombre y apellido"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.nombre_apellido_recibe}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              nombre_apellido_recibe: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="D.N.I."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.dni_recibe}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              dni_recibe: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Cargo/función"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.cargo_funcion}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              cargo_funcion: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Sección 3: INSPECCIÓN */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        3. Inspección
                      </h3>

                      {/* a. Coincide el domicilio */}

                      <div className="mb-4">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            a. ¿Coincide el domicilio declarado con el domicilio
                            efectivo e inspeccionado?
                          </span>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="domicilio-edit"
                              value="si"
                              className="accent-blue-600"
                              checked={editFormData.coincide_domicilio === "si"}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  coincide_domicilio: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">Sí</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name="domicilio-edit"
                              value="no"
                              className="accent-red-600"
                              checked={editFormData.coincide_domicilio === "no"}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  coincide_domicilio: e.target.value,
                                })
                              }
                            />
                            <span className="text-sm">No</span>
                          </label>
                        </div>
                        <input
                          type="text"
                          placeholder="En caso negativo, domicilio efectivo e inspeccionado"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.domicilio_efectivo}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              domicilio_efectivo: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* b. Actividad efectivamente desarrollada */}

                      <div className="mb-4">
                        <label className="text-sm font-medium text-gray-700 block mb-2">
                          b. Actividad efectivamente desarrollada:
                        </label>
                        <textarea
                          placeholder="Describa la actividad..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-20 resize-none"
                          value={editFormData.actividad_desarrollada}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              actividad_desarrollada: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* c. Condiciones de higiene en general */}

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            c. Condiciones de higiene en general
                          </h4>
                          <div className="space-y-2">
                            {[
                              { id: "higiene-1", label: "Orden y limpieza" },
                              { id: "higiene-2", label: "Baños" },
                              {
                                id: "higiene-3",
                                label: "Cantidad de baños completos y retrete",
                              },
                              { id: "higiene-4", label: "Cantidad de baños" },
                              {
                                id: "higiene-5",
                                label: "Cantidad de baños completos",
                              },
                              {
                                id: "higiene-6",
                                label: "Cantidad de baños con retrete",
                              },
                            ].map((item) => (
                              <label
                                key={item.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={editFormData.condiciones_higiene.includes(
                                    item.label
                                  )}
                                  onChange={(e) => {
                                    const newHigiene = e.target.checked
                                      ? [
                                          ...editFormData.condiciones_higiene,
                                          item.label,
                                        ]
                                      : editFormData.condiciones_higiene.filter(
                                          (h) => h !== item.label
                                        );
                                    setEditFormData({
                                      ...editFormData,
                                      condiciones_higiene: newHigiene,
                                    });
                                  }}
                                />
                                <span className="text-sm">{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">
                            Complemento de elementos de seguridad
                          </h4>
                          <div className="space-y-2">
                            {[
                              {
                                id: "seguridad-1",
                                label:
                                  "¿Posee botiquín de primeros auxilios con los elementos mínimos?",
                              },
                              {
                                id: "seguridad-2",
                                label: "Matafuego (varios)",
                              },
                              {
                                id: "seguridad-3",
                                label: "¿Están en vigencia los matafuegos?",
                              },
                              {
                                id: "seguridad-4",
                                label: "Tipos de matafuegos",
                              },
                              {
                                id: "seguridad-5",
                                label: "¿Los matafuegos tienen señalizacion?",
                              },
                              {
                                id: "seguridad-6",
                                label:
                                  "¿Posee salida de emergencia bien señalizada?",
                              },
                            ].map((item) => (
                              <label
                                key={item.id}
                                className="flex items-center space-x-2"
                              >
                                <input
                                  type="checkbox"
                                  className="accent-blue-600"
                                  checked={editFormData.elementos_seguridad.includes(
                                    item.label
                                  )}
                                  onChange={(e) => {
                                    const newSeguridad = e.target.checked
                                      ? [
                                          ...editFormData.elementos_seguridad,
                                          item.label,
                                        ]
                                      : editFormData.elementos_seguridad.filter(
                                          (s) => s !== item.label
                                        );
                                    setEditFormData({
                                      ...editFormData,
                                      elementos_seguridad: newSeguridad,
                                    });
                                  }}
                                />
                                <span className="text-sm">{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* d. Condiciones de agua */}
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                          d. Condiciones de agua
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm">Estado:</span>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="agua-estado-edit"
                                value="potable"
                                className="accent-blue-600"
                                checked={editFormData.estado_agua === "potable"}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    estado_agua: e.target.value,
                                  })
                                }
                              />
                              <span className="text-sm">Potable</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                name="agua-estado-edit"
                                value="no-potable"
                                className="accent-red-600"
                                checked={
                                  editFormData.estado_agua === "no-potable"
                                }
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    estado_agua: e.target.value,
                                  })
                                }
                              />
                              <span className="text-sm">No potable</span>
                            </label>
                          </div>
                          <input
                            type="text"
                            placeholder="Lugar de depósito de residuos para desalojo"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            value={editFormData.lugar_deposito_residuos}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                lugar_deposito_residuos: e.target.value,
                              })
                            }
                          />
                          <textarea
                            placeholder="Observaciones..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-16 resize-none"
                            value={editFormData.observaciones_agua}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                observaciones_agua: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      {/* Muebles de materiales, Manejo, Estado */}

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Muebles de materiales"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.muebles_materiales}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              muebles_materiales: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Manejo"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.manejo}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              manejo: e.target.value,
                            })
                          }
                        />
                        <input
                          type="text"
                          placeholder="Estado"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          value={editFormData.estado}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              estado: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    {/* Sección 4: DEBERES FORMALES */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        4. Deberes Formales
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-normal text-gray-700">
                          Certificación de desinfección (ordenanza N° 2819):
                        </span>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion-edit"
                            value="si"
                            className="accent-blue-600"
                            checked={
                              editFormData.certificacion_desinfeccion === "si"
                            }
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                certificacion_desinfeccion: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">Sí</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion-edit"
                            value="no"
                            className="accent-red-600"
                            checked={
                              editFormData.certificacion_desinfeccion === "no"
                            }
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                certificacion_desinfeccion: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">No</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion-exhibe-edit"
                            value="si"
                            className="accent-blue-600"
                            checked={editFormData.certificacion_exhibe === "si"}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                certificacion_exhibe: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">
                            En caso afirmativo, exhibe: Sí
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="certificacion-exhibe-edit"
                            value="no"
                            className="accent-blue-600"
                            checked={editFormData.certificacion_exhibe === "no"}
                            onChange={(e) =>
                              setEditFormData({
                                ...editFormData,
                                certificacion_exhibe: e.target.value,
                              })
                            }
                          />
                          <span className="text-sm">No</span>
                        </label>
                      </div>
                    </div>

                    {/* Sección 5: OBSERVACIONES Y DESCRIPCIÓN GENERAL */}

                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4 uppercase">
                        5. Observaciones y Descripción General
                      </h3>
                      <textarea
                        maxLength={800}
                        placeholder="Escriba sus observaciones generales aquí..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm h-32 resize-none"
                        value={editFormData.observaciones_generales}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            observaciones_generales: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* BOTONES DE OPCIONES */}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditModalOpen(false);
                          setActaToEdit(null);
                        }}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-5"
                      >
                        Actualizar Acta de Inspección
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* PAGINACION */}
          <div className="px-6 py-4 flex items-center justify-center space-x-2">
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
    </LoaderContent>
  );
};

export default ActasInspeccion;
