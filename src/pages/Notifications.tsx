"use client"

import type React from "react"
import {
  Bell,
  Eye,
  Edit,
  Trash2,
  FolderClock,
  ClipboardList,
  Plus,
  X,
  TriangleAlert,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"
import { LoaderContent } from "@/components/LoaderComponent"
import { apiClient } from "@/services/authService"

interface Notification {
  id: number
  tipo_infraccion: string[]
  nro_notificacion: string
  detalle_notificacion: string
  hora_notificacion?: string
  fecha_notificacion: string
  plazo_dias: number
  fecha_vencimiento?: string
  nombre_inspector: string
  identificador_inspector: string
  // ---------
  nombre_contribuyente: string
  apellido_contribuyente: string
  dni_contribuyente: string
  direccion_notificacion: string
}

interface Inspector {
  id: number
  nombres: string
  apellidos: string
  identificador: string
}

enum TIPO_INFRACCION {
  MATA_FUEGO = "MATA FUEGO",
  OEP_ARIDOS = "OEP ÁRIDOS MATERIALES DE CONSTRUCCIÓN",
  VEHICULOS_ABANDONO = "VEHÍCULOS EN ESTADO DE ABANDONO",
  CHATARRA = "CHATARRA",
  CHASIS = "CHASIS",
  ESQUELETOS_VEHICULOS = "ESQUELETOS VEHÍCULOS",
  OTROS = "OTROS",
  LAVADO_VEREDA = "LAVADO DE VEREDA",
  PERDIDA_AGUA = "PÉRDIDA DE AGUA/LÍQUIDOS CLOACALES",
  REPARACION_VEREDA = "REPARACION DE VEREDA",
  HABILITACION_COMERCIAL = "HABILITACIÓN COMERCIAL DEFINITIVA",
}

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const [filterType, setFilterType] = useState("")
  const [filterValue, setFilterValue] = useState("")
  const [allInspector, setAllInspector] = useState<Inspector[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [totalNotifications, setTotalNotifications] = useState(0)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [notificationToEdit, setNotificationToEdit] = useState<Notification | null>(null)

  // Loader

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // GET NOTIS

  const getNotifications = async () => {
    try {
      setIsLoading(true)
      const url = `${API_URL}/notificacion?page=${currentPage}&size=${itemsPerPage}`

      const res = await axios.get(url)

      const payload = Array.isArray(res.data) ? res.data : (res.data?.data ?? res.data?.notifications ?? res.data)

      const total = res.data.total ?? payload.length
      setTotalNotifications(total)

      const normalized = payload.map(normalizeNotificationFromBackend)
      setNotifications(normalized)
    } catch (error) {
      console.error("Error al obtener notificaciones:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getNotifications()
  }, [currentPage, itemsPerPage])

  const [formData, setFormData] = useState({
    nro_notificacion: "",
    tipo_infraccion: [] as string[],
    detalle_notificacion: "",
    fecha_notificacion: "",
    hora_notificacion: "",
    plazo_dias: 3,
    inspector_id: [] as number[],
    nombre_contribuyente: "",
    apellido_contribuyente: "",
    dni_contribuyente: "",
    direccion_contribuyente: "",
  })

  const API_URL = "http://localhost:4000/api/v1"

  // GET INSPECTORES

  const getAllInspectorForSelect = async () => {
    const { data } = await apiClient.get(`inspector/all-inspector`)
    setAllInspector(data)
  }
  useEffect(() => {
    getAllInspectorForSelect()
  }, [])

  const normalizeNotificationFromBackend = (raw: any): Notification => {
    return {
      id: raw.id,
      tipo_infraccion: Array.isArray(raw.tipo_infraccion) ? raw.tipo_infraccion : [raw.tipo_infraccion ?? ""],
      nro_notificacion: raw.nro_notificacion ?? "",
      detalle_notificacion: raw.detalle_notificacion ?? "",
      hora_notificacion: raw.hora_notificacion ?? "",
      fecha_notificacion: raw.fecha_notificacion ?? "",
      plazo_dias: raw.plazo_dias ?? 0,
      fecha_vencimiento: raw.fecha_vencimiento ?? "",
      nombre_inspector: raw.nombre_inspector ?? raw.inspector?.nombres ?? "",
      identificador_inspector: raw.identificador_inspector ?? raw.inspector?.identificador ?? "",
      nombre_contribuyente: raw.nombre_contribuyente ?? raw.contribuyente?.nombre ?? "",
      apellido_contribuyente: raw.apellido_contribuyente ?? raw.contribuyente?.apellido ?? "",
      dni_contribuyente: raw.dni_contribuyente ?? raw.contribuyente?.dni ?? "",
      direccion_notificacion: raw.direccion_notificacion ?? raw.contribuyente?.direccion ?? "",
    }
  }

  // CREATE

  const createNotification = async () => {
    try {
      const payload = {
        notificacion: {
          nro_notificacion: formData.nro_notificacion,
          fecha_notificacion: formData.fecha_notificacion,
          hora_notificacion: formData.hora_notificacion,
          detalle_notificacion: formData.detalle_notificacion,
          plazo_dias: formData.plazo_dias,
          inspector_id: formData.inspector_id,
          tipo_infraccion: formData.tipo_infraccion,
        },
        contribuyente: {
          nombre: formData.nombre_contribuyente,
          apellido: formData.apellido_contribuyente,
          direccion: formData.direccion_contribuyente,
          dni: formData.dni_contribuyente,
        },
      }

      console.log("📤 Payload enviado:", payload)

      const res = await axios.post(`${API_URL}/notificacion`, payload)

      console.log("✅ Respuesta del backend:", res.data)

      await getNotifications()
      alert("✅ Notificación creada exitosamente")
      handleCloseForm()
    } catch (error: any) {
      console.error("Error al crear notificación:", error.response?.data?.message || error.message)
      alert(`Error al crear notificación: ${error.response?.data?.message || error.message}`)
    }
  }

  // UPDATE

  const updateNotification = async (id: number, updatedData: Partial<typeof editFormData>) => {
    try {
      const payload = {
        nro_notificacion: updatedData.nro_notificacion,
        tipo_infraccion: updatedData.tipo_infraccion,
        detalle_notificacion: updatedData.detalle_notificacion,
        fecha_notificacion: updatedData.fecha_notificacion,
        hora_notificacion: updatedData.hora_notificacion,
        plazo_dias: updatedData.plazo_dias,
      }

      console.log("📤 Actualizando notificación ID:", id)
      console.log("📤 Payload enviado:", JSON.stringify(payload, null, 2))

      const res = await axios.patch(`${API_URL}/notificacion/${id}`, payload)

      console.log("✅ Respuesta del backend:", res.data)

      await getNotifications()
      alert("✅ Notificación actualizada exitosamente")
    } catch (error: any) {
      console.error("❌ Error al actualizar notificación:", error)
      console.error("❌ Respuesta del error:", error.response?.data)
      alert(`Error al actualizar notificación: ${error.response?.data?.message || error.message}`)
    }
  }

  // DELETE

  const deleteNotification = async (id: number) => {
    if (!confirm("¿Está seguro de que desea desactivar este inspector?")) {
      return
    }

    try {
      console.log("🗑️ Desactivando notificacion:", id)
      await axios.get(`${API_URL}/notificacion/delete/${id}`, {
        data: { activo: "false" },
      })
      console.log("✅ notificacion desactivado")

      await getNotifications()

      alert("✅ notificacion desactivado exitosamente")
    } catch (error: any) {
      console.error("❌ Error al desactivar notificacion:", error)
      console.error("❌ Respuesta del error:", error.response?.data)
      alert(`Error al desactivar notificacion: ${error.response?.data?.message || error.message}`)
    }
  }

  const filteredNotifications = Array.isArray(notifications)
    ? notifications.filter((notification) => {
        if (!filterType || !filterValue) return true

        switch (filterType) {
          case "Fecha":
            return (
              notification.fecha_notificacion.includes(filterValue) ||
              (notification.fecha_vencimiento && notification.fecha_vencimiento.includes(filterValue))
            )
          case "Numero de Notificacion":
            return notification.nro_notificacion.toLowerCase().includes(filterValue.toLowerCase())
          case "Tipo":
            return notification.tipo_infraccion.some((tipo) => tipo.toLowerCase().includes(filterValue.toLowerCase()))
          default:
            return true
        }
      })
    : []

  const totalPages = Math.max(1, Math.ceil(totalNotifications / itemsPerPage))
  const currentNotifications = filteredNotifications

  const handleFilterChange = (value: string) => {
    setFilterType(value)
    setFilterValue("")
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilterType("")
    setFilterValue("")
    setCurrentPage(1)
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  const handleNuevaNotificacion = () => {
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setFormData({
      nro_notificacion: "",
      tipo_infraccion: [],
      detalle_notificacion: "",
      fecha_notificacion: "",
      hora_notificacion: "",
      plazo_dias: 3,
      inspector_id: [],
      nombre_contribuyente: "",
      apellido_contribuyente: "",
      dni_contribuyente: "",
      direccion_contribuyente: "",
    })
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.inspector_id.length === 0) {
      alert("Debe seleccionar al menos un inspector")
      return
    }
    if (formData.tipo_infraccion.length === 0) {
      alert("Debe seleccionar al menos un tipo de infracción")
      return
    }

    await createNotification()
  }

  const handleEditClick = (notification: Notification) => {
    setNotificationToEdit(notification)
    setEditFormData({
      nro_notificacion: notification.nro_notificacion,
      tipo_infraccion: notification.tipo_infraccion,
      detalle_notificacion: notification.detalle_notificacion,
      fecha_notificacion: notification.fecha_notificacion,
      hora_notificacion: notification.hora_notificacion ?? "",
      plazo_dias: notification.plazo_dias,
    })
    setIsEditModalOpen(true)
  }

  // EDITAR NOTI

  const [editFormData, setEditFormData] = useState({
    nro_notificacion: "",
    tipo_infraccion: [] as string[],
    detalle_notificacion: "",
    fecha_notificacion: "",
    hora_notificacion: "",
    plazo_dias: 3,
  })

  const handleEditFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (notificationToEdit) {
      await updateNotification(notificationToEdit.id, editFormData)
      setIsEditModalOpen(false)
      setNotificationToEdit(null)
    }
  }

  // VER DETALLES

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsModalOpen(true)
  }

  // CERRAR MODAL

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedNotification(null)
  }

  const handleInspectorToggle = (inspectorId: number) => {
    setFormData((prev) => ({
      ...prev,
      inspector_id: prev.inspector_id.includes(inspectorId)
        ? prev.inspector_id.filter((id) => id !== inspectorId)
        : [...prev.inspector_id, inspectorId],
    }))
  }

  const handleTipoInfraccionToggle = (tipo: string) => {
    setFormData((prev) => ({
      ...prev,
      tipo_infraccion: prev.tipo_infraccion.includes(tipo)
        ? prev.tipo_infraccion.filter((t) => t !== tipo)
        : [...prev.tipo_infraccion, tipo],
    }))
  }

  const handleEditTipoInfraccionToggle = (tipo: string) => {
    setEditFormData((prev) => ({
      ...prev,
      tipo_infraccion: prev.tipo_infraccion.includes(tipo)
        ? prev.tipo_infraccion.filter((t) => t !== tipo)
        : [...prev.tipo_infraccion, tipo],
    }))
  }

  return (
    <LoaderContent isLoading={isLoading} loadingText="Cargando Notificaciones..." minHeight="400px">
     {/* Próximas a vencer */}
<div className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800 max-w-full mx-auto p-6 space-y-6 rounded-2xl border border-slate-800/70 backdrop-blur-md mb-3">
  <div className="bg-slate-800 rounded-2xl border border-slate-700/50 shadow-lg overflow-hidden">
    {/* Encabezado */}
    <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/30">
          <FolderClock className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Próximas a Vencer
        </h1>
      </div>
    </div>

    {/* Contenido */}
    <div className="p-6 space-y-3">
      {currentNotifications.slice(0, 3).length > 0 ? (
        currentNotifications.slice(0, 3).map((notification) => (
          <div
            key={`preview-${notification.id}`}
            className="flex items-start gap-4 p-5 bg-slate-700/60 border border-slate-600/60 rounded-xl hover:border-red-500 hover:bg-slate-700/80 transition-all duration-200 shadow-md"
          >
            <div className="flex-shrink-0 mt-1">
              <TriangleAlert className="w-6 h-6 text-red-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-bold text-white capitalize">
                  {notification.detalle_notificacion}
                </p>
                <span className="text-xs text-slate-300">
                  {notification.fecha_vencimiento}
                </span>
              </div>

              <h3 className="text-sm text-slate-400 font-medium mt-1">
                {notification.tipo_infraccion.join(", ")}
              </h3>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <div className="bg-red-500/10 p-4 w-fit mx-auto rounded-full border border-red-500/30">
            <Bell className="w-10 h-10 text-red-500 mx-auto" />
          </div>
          <p className="text-slate-300 mt-4 font-medium">
            No hay notificaciones próximas a vencer
          </p>
        </div>
      )}
    </div>
  </div>
</div>


        {/* Lista de notis */}

        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800 p-8 rounded-lg">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row justify-center items-center text-center sm:text-left gap-4">
                  <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/30">
                    <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                    Lista de Notificaciones
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
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="bg-slate-700/80 border border-slate-600/50 text-white rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                  >
                    <option value="">Filtros</option>
                    <option value="Fecha">Fecha</option>
                    <option value="Numero de Notificacion">Número de Notificación</option>
                    <option value="Tipo">Tipo de Infracción</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Buscar Notificacion..."
                    value={filterValue}
                    onChange={(e) => {
                      setCurrentPage(1)
                      setFilterValue(e.target.value)
                    }}
                    className="flex-1 bg-slate-700/80 border border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-yellow-600 focus:border-transparent transition-all hover:bg-slate-700 shadow-lg"
                  />
                </div>

                {(filterType || filterValue) && (
                  <button
                    className="flex items-center px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
                    onClick={clearFilters}
                  >
                    Limpiar
                  </button>
                )}
                {/* NUEVA NOTIFICACION */}
                <button
                  onClick={handleNuevaNotificacion}
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-400 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nueva Notificación</span>
                </button>
              </div>
            </div>

            {/* TABLA */}

            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 border-b-2 border-yellow-600">
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
                    {currentNotifications.length > 0 ? (
                      currentNotifications.map((notification, index) => (
                        <tr
                          key={`table-${notification.id}`}
                          className={`${
                            index % 2 === 0 ? "bg-slate-800/30" : "bg-slate-800/50"
                          } hover:bg-slate-700/50 transition-all duration-200 hover:shadow-lg`}
                        >
                          <td className="px-6 py-4 text-sm font-semibold text-white">
                            {notification.nro_notificacion}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {notification.tipo_infraccion.join(", ")}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-300">{notification.fecha_notificacion}</td>
                          <td className="px-6 py-4 text-sm text-slate-300">{notification.nombre_inspector}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center space-x-2">
                              {/* BOTONES */}

                              <button
                                onClick={() => handleViewDetails(notification)}
                                className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-cyan-500/30"
                                title="Ver detalles"
                              >
                                <Eye className="w-5 h-5" />
                              </button>

                              <button
                                onClick={() => handleEditClick(notification)}
                                className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 p-2.5 rounded-xl transition-all duration-200 hover:scale-110 border border-transparent hover:border-amber-500/30"
                                title="Editar notificación"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => deleteNotification(notification.id)}
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
                            <p className="text-slate-400 text-lg font-medium">No se encontraron resultados</p>
                            <p className="text-slate-500 text-sm">Intenta ajustar los filtros de búsqueda</p>
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
                    Página <span className="text-white">{totalPages === 0 ? 0 : currentPage}</span> de{" "}
                    <span className="text-white">{totalPages}</span>
                  </span>
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    currentPage === totalPages || totalPages === 0
                      ? "bg-slate-700/50 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-cyan-500 hover:to-cyan-400 hover:scale-105"
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

     {/* NUEVA NOTIFICACIÓN */}
{showForm && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-8">

      {/* Encabezado */}
      <div className="flex items-center justify-center gap-3 mb-8 bg-slate-800/50 border border-orange-500/30 rounded-xl p-4 shadow-lg">
        <div className="bg-orange-500/10 p-3 rounded-xl border border-orange-500/30">
          <Bell className="w-8 h-8 text-orange-400" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-400 via-yellow-300 to-orange-200 bg-clip-text text-transparent tracking-wide">
          Nueva Notificación
        </h2>
      </div>

      {/* Formulario */}
      <form className="space-y-6" onSubmit={handleFormSubmit}>
        {/* Inspectores */}
        <div>
          <label className="font-semibold text-slate-200 block mb-2">
            Selecciona Inspector *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allInspector.length > 0 ? (
              allInspector.map((insp) => (
                <label
                  key={insp.id}
                  className="flex items-center gap-2 bg-slate-800/60 rounded-lg p-2 border border-slate-700/50 hover:border-orange-500/40 transition-all duration-150"
                >
                  <input
                    type="checkbox"
                    checked={formData.inspector_id.includes(insp.id)}
                    onChange={() => handleInspectorToggle(insp.id)}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-slate-100 text-sm">
                    {insp.nombres} {insp.apellidos}
                  </span>
                </label>
              ))
            ) : (
              <p className="text-yellow-400 text-sm">
                No hay inspectores disponibles. Por favor, agregue inspectores primero.
              </p>
            )}
          </div>
        </div>

        {/* N° Notificación */}
        <input
          type="text"
          placeholder="N° Notificación *"
          value={formData.nro_notificacion}
          onChange={(e) =>
            setFormData({ ...formData, nro_notificacion: e.target.value })
          }
          required
          className="w-full bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />

        {/* Tipo de Infracción */}
        <div>
          <h3 className="font-semibold text-slate-200 mb-2">
            Tipo de Infracción: *
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(TIPO_INFRACCION).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 bg-slate-800/60 rounded-lg p-2 border border-slate-700/50 hover:border-orange-500/40 transition-all"
              >
                <input
                  type="checkbox"
                  checked={formData.tipo_infraccion.includes(label)}
                  onChange={() => handleTipoInfraccionToggle(label)}
                  className="accent-orange-500"
                />
                <span className="text-slate-100 text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Observaciones */}
        <textarea
          maxLength={600}
          placeholder="Observaciones... *"
          value={formData.detalle_notificacion}
          onChange={(e) =>
            setFormData({
              ...formData,
              detalle_notificacion: e.target.value,
            })
          }
          required
          className="w-full h-28 resize-none bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
        />

        {/* Fechas y Plazo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Fecha Notificación *
            </label>
            <input
              type="date"
              value={formData.fecha_notificacion}
              onChange={(e) =>
                setFormData({ ...formData, fecha_notificacion: e.target.value })
              }
              required
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">Hora *</label>
            <input
              type="time"
              value={formData.hora_notificacion}
              onChange={(e) =>
                setFormData({ ...formData, hora_notificacion: e.target.value })
              }
              required
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="text-slate-300 text-sm mb-1 block">
              Plazo (días) *
            </label>
            <input
              type="number"
              min="1"
              placeholder="Plazo en días"
              value={formData.plazo_dias}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  plazo_dias: Number.parseInt(e.target.value) || 0,
                })
              }
              required
              className="w-full bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Datos Contribuyente */}
        <div className="border-t border-slate-700/50 pt-6">
          <h3 className="text-slate-200 font-semibold mb-3">
            Datos del Contribuyente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              ["nombre_contribuyente", "Nombre *"],
              ["apellido_contribuyente", "Apellido *"],
              ["dni_contribuyente", "CUIL *"],
              ["direccion_contribuyente", "Dirección *"],
            ].map(([key, placeholder]) => (
              <input
                key={key}
                type="text"
                placeholder={placeholder}
                 value={formData[key] ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, [key]: e.target.value })
                }
                required
                className={`bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                  key === "direccion_contribuyente" ? "md:col-span-2" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8">
          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-slate-700/70 hover:bg-slate-600/70 text-slate-200 font-semibold transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
            onClick={handleCloseForm}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-yellow-500 hover:from-orange-500 hover:to-yellow-400 text-white font-semibold shadow-md transition-all duration-300"
          >
            Agregar Notificación +
          </button>
        </div>
      </form>
    </div>
  </div>
)}


 {/* Editar Notificación */}
{isEditModalOpen && notificationToEdit && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh] transition-all duration-300">
    

      {/* Título */}
      <div className="flex items-center justify-center bg-slate-800/60 border border-slate-700/50 rounded-xl py-3 mb-6 shadow-inner">
        <Bell className="w-8 h-8 text-orange-500 mr-2" />
        <h2 className="text-3xl font-bold text-white text-center bg-gradient-to-r from-white via-orange-100 to-orange-400 bg-clip-text text-transparent">
          Editar Notificación
        </h2>
      </div>

      {/* Formulario */}
      <form className="space-y-5" onSubmit={handleEditFormSubmit}>
        {/* Número de notificación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="N° Notificación"
            value={editFormData.nro_notificacion}
            onChange={(e) =>
              setEditFormData({
                ...editFormData,
                nro_notificacion: e.target.value,
              })
            }
            className="bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Tipo de infracción */}
        <div>
          <h3 className="font-semibold text-white mb-3">Tipo de Infracción:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {(Object.entries(TIPO_INFRACCION) as [keyof typeof TIPO_INFRACCION, string][]).map(
              ([key, label]) => (
                <label key={key} className="flex items-center space-x-2 bg-slate-700/40 p-2 rounded-lg hover:bg-slate-700/60 transition">
                  <input
                    type="checkbox"
                    checked={editFormData.tipo_infraccion.includes(label)}
                    onChange={() => handleEditTipoInfraccionToggle(label)}
                    className="accent-orange-500 w-4 h-4"
                  />
                  <span className="text-white text-sm">{label}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Observaciones */}
        <textarea
          maxLength={500}
          placeholder="Observaciones..."
          value={editFormData.detalle_notificacion}
          onChange={(e) =>
            setEditFormData({
              ...editFormData,
              detalle_notificacion: e.target.value,
            })
          }
          className="bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all w-full h-28 resize-none"
        />

        {/* Fechas y plazo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-300 text-sm block mb-1">Fecha Notificación</label>
            <input
              type="date"
              value={editFormData.fecha_notificacion}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  fecha_notificacion: e.target.value,
                })
              }
              className="bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all w-full"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm block mb-1">Hora</label>
            <input
              type="time"
              value={editFormData.hora_notificacion}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  hora_notificacion: e.target.value,
                })
              }
              className="bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all w-full"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm block mb-1">Plazo (días)</label>
            <input
              type="number"
              min="1"
              placeholder="Plazo en días"
              value={editFormData.plazo_dias}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  plazo_dias: Number.parseInt(e.target.value) || 0,
                })
              }
              className="bg-slate-800/60 border border-slate-700/50 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all w-full"
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8">
          <button
            type="button"
            onClick={() => {
              setIsEditModalOpen(false)
              setNotificationToEdit(null)
            }}
            className="bg-slate-700 text-white px-5 py-2.5 rounded-xl hover:bg-slate-600 transition-all shadow-md"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2.5 rounded-xl hover:from-orange-500 hover:to-red-500 font-semibold transition-all shadow-lg"
          >
            Actualizar Notificación
          </button>
        </div>
      </form>
    </div>
  </div>
)}

{/* MODAL EYE */}

{isModalOpen && selectedNotification && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-slate-800/95 rounded-2xl shadow-2xl border border-slate-700/60 max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh] transition-all duration-300">

      {/* Botón cerrar (ajustado) */}
      <button
        onClick={handleCloseModal}
        className="absolute -top-1 -right-1 text-white hover:text-red-500 p-4 mb-3"
        title="Cerrar"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Encabezado */}
      <div className="bg-slate-700 rounded-lg p-5 flex items-center justify-center mb-6 mt-2 shadow-inner border border-slate-600/50">
        <Bell className="w-8 h-8 text-orange-500 mr-3" />
        <h2 className="text-3xl font-bold text-white text-center">
          Notificación #{selectedNotification.nro_notificacion}
        </h2>
      </div>

      {/* Datos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center bg-slate-700/50 rounded-lg p-4 shadow-md border border-slate-600">
          <h3 className="text-sm font-semibold text-orange-400 mb-1">
            Tipo de Infracción
          </h3>
          <p className="text-lg font-bold text-orange-300">
            {selectedNotification.tipo_infraccion.join(", ")}
          </p>
        </div>
        <div className="text-center bg-slate-700/50 rounded-lg p-4 shadow-md border border-slate-600">
          <h3 className="text-sm font-semibold text-orange-400 mb-1">
            Inspector
          </h3>
          <p className="text-lg font-bold text-blue-400">
            {selectedNotification.nombre_inspector}
          </p>
        </div>
      </div>

      {/* Observaciones */}
      <div className="bg-slate-700/40 rounded-lg p-4 border border-slate-600 mb-6">
        <h3 className="text-sm font-semibold text-orange-400 mb-2">
          Observaciones
        </h3>
        <p className="text-gray-200 whitespace-pre-wrap">
          {selectedNotification.detalle_notificacion || "—"}
        </p>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="text-center bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <h3 className="text-sm font-semibold text-white mb-1">
            Fecha de Notificación
          </h3>
          <p className="text-gray-200">{selectedNotification.fecha_notificacion}</p>
        </div>
        <div className="text-center bg-slate-700/50 rounded-lg p-4 border border-slate-600">
          <h3 className="text-sm font-semibold text-white mb-1">
            Fecha de Vencimiento
          </h3>
          <p className="text-gray-200">{selectedNotification.fecha_vencimiento}</p>
        </div>
      </div>

      {/* Datos del contribuyente */}
      <div className="border-t border-slate-600 pt-5">
        <h3 className="text-lg font-bold text-orange-400 mb-4 text-center">
          Datos del Contribuyente
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600">
            <h4 className="text-sm font-medium text-white mb-1">Nombre</h4>
            <p className="text-gray-200">{selectedNotification.nombre_contribuyente}</p>
          </div>
          <div className="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600">
            <h4 className="text-sm font-medium text-white mb-1">Apellido</h4>
            <p className="text-gray-200">{selectedNotification.apellido_contribuyente}</p>
          </div>
          <div className="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600">
            <h4 className="text-sm font-medium text-white mb-1">DNI</h4>
            <p className="text-gray-200">{selectedNotification.dni_contribuyente}</p>
          </div>
          <div className="bg-slate-700/40 rounded-lg p-3 text-center border border-slate-600 md:col-span-2">
            <h4 className="text-sm font-medium text-white mb-1">Dirección</h4>
            <p className="text-gray-200">{selectedNotification.direccion_notificacion}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}
    </LoaderContent>
  )
}

export default Notifications
