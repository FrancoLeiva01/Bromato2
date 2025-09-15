"use client"

import type React from "react"
import { Bell, Clock, CheckCircle, AlertTriangle, Info, ChevronLeft, ChevronRight, Eye, FolderClock } from "lucide-react"
import { useState } from "react"

interface Notification {
  id: number
  type: "info" | "warning" | "success" | "alert"
  title: string
  message: string
  time: string
  read: boolean
  notificationNumber: string
  expirationDate: string
  notificationDate: string
  status: "VERIFICADA" | "VENCIDA" | "PENDIENTE"
}

const Notifications: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode] = useState<"cards" | "table">("cards")
  const itemsPerPage = viewMode === "cards" ? 3 : 8
  const maxPages = 5

  const notifications: Notification[] = [
    {
      id: 1,
      type: "warning",
      title: "Proximo a Vencer",
      message: 'Restaurante "El Buen Sabor" requiere inspección inmediata por denuncia sanitaria.',
      time: "2 min",
      read: false,
      notificationNumber: "0875",
      expirationDate: "2025-01-02",
      notificationDate: "2024-11-27",
      status: "VERIFICADA"
    },
    {
      id: 2,
      type: "warning",
      title: "Proximo a Vencer",
      message: 'Notificacion a vencer de supermercado "Los Andes"',
      time: "1 hora",
      read: false,
      notificationNumber: "1868",
      expirationDate: "2025-01-13",
      notificationDate: "2025-01-06",
      status: "VENCIDA"
    },
    {
      id: 3,
      type: "warning",
      title: "Proximo a Vencer",
      message: 'Notificacion a vencer de supermercado "Los Andes".',
      time: "2 horas",
      read: true,
      notificationNumber: "1873",
      expirationDate: "2025-01-13",
      notificationDate: "2025-01-07",
      status: "VENCIDA"
    },
    {
      id: 4,
      type: "alert",
      title: "Proximo a Vencer",
      message: 'Notificacion a vencer de "Cafetería Universitaria".',
      time: "3 horas",
      read: true,
      notificationNumber: "1857",
      expirationDate: "2025-01-14",
      notificationDate: "2025-01-07",
      status: "VENCIDA"
    },
    {
      id: 5,
      type: "alert",
      title: "Documentación Pendiente",
      message: 'Notificacion a vencer de supermercado "Los Andes".',      
      time: "1 día",
      read: true,
      notificationNumber: "1869",
      expirationDate: "2025-01-14",
      notificationDate: "2025-01-07",
      status: "VERIFICADA"
    },
    {
      id: 6,
      type: "alert",
      title: "Proximo a Vencer",
      message: 'Notificacion a vencer de supermercado "Los Andes".',
      time: "2 días",
      read: true,
      notificationNumber: "1874",
      expirationDate: "2025-01-14",
      notificationDate: "2025-01-07",
      status: "VERIFICADA"
    },
    {
      id: 7,
      type: "alert",
      title: "Habilitación Aprobada",
      message: 'Notificacion a vencer de supermercado "Los Andes".',      
      time: "3 días",
      read: true,
      notificationNumber: "1896",
      expirationDate: "2025-01-17",
      notificationDate: "2025-01-03",
      status: "VENCIDA"
    },
    {
      id: 8,
      type: "alert",
      title: "Renovación Pendiente",
      message: 'Notificacion a vencer de supermercado "Los Andes".',
      time: "4 días",
      read: true,
      notificationNumber: "1845",
      expirationDate: "2025-01-17",
      notificationDate: "2025-01-03",
      status: "VENCIDA"
    },
    {
      id: 9,
      type: "alert",
      title: "Inspección Programada",
      message: 'Notificacion a vencer de supermercado "Los Andes".',
      time: "5 días",
      read: true,
      notificationNumber: "1892",
      expirationDate: "2025-01-18",
      notificationDate: "2025-01-04",
      status: "PENDIENTE"
    },
    {
      id: 10,
      type: "alert",
      title: "Capacitación Completada",
      message: 'Notificacion a vencer de supermercado "Los Andes".',
      time: "1 semana",
      read: true,
      notificationNumber: "1834",
      expirationDate: "2025-01-18",
      notificationDate: "2025-01-04",
      status: "PENDIENTE"
    },
    {
      id: 11,
      type: "alert",
      title: "Denuncia Recibida",
      message: 'Nueva denuncia sanitaria contra "Comedor Estudiantil".',
      time: "1 semana",
      read: true,
      notificationNumber: "1823",
      expirationDate: "2025-01-19",
      notificationDate: "2025-01-05",
      status: "VERIFICADA"
    },
    {
      id: 12,
      type: "alert",
      title: "Actualización Normativa",
      message: "Nueva normativa sanitaria vigente desde el 1 de octubre.",
      time: "2 semanas",
      read: true,
      notificationNumber: "1812",
      expirationDate: "2025-01-20",
      notificationDate: "2025-01-06",
      status: "VERIFICADA"
    },
    {
      id: 13,
      type: "alert",
      title: "Multa Aplicada",
      message: 'Multa aplicada a "Restaurante del Puerto" por infracciones menores.',
      time: "2 semanas",
      read: true,
      notificationNumber: "1801",
      expirationDate: "2025-01-21",
      notificationDate: "2025-01-07",
      status: "PENDIENTE"
    },
    {
      id: 14,
      type: "alert",
      title: "Reinspección Exitosa",
      message: 'Reinspección exitosa en "Cafetería Central", se levantaron observaciones.',
      time: "3 semanas",
      read: true,
      notificationNumber: "1789",
      expirationDate: "2025-01-22",
      notificationDate: "2025-01-08",
      status: "VERIFICADA"
    },
    {
      id: 15,
      type: "alert",
      title: "Solicitud de Ampliación",
      message: 'Solicitud de ampliación de horarios para "Bar Nocturno".',
      time: "1 mes",
      read: true,
      notificationNumber: "1778",
      expirationDate: "2025-01-23",
      notificationDate: "2025-01-09",
      status: "PENDIENTE"
    },
  ]

  const totalPages = Math.min(Math.ceil(notifications.length / itemsPerPage), maxPages)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentNotifications = notifications.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case "warning":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBorderColor = (type: string) => {
    switch (type) {
      case "alert":
        return "border-l-red-500"
      case "warning":
        return "border-l-yellow-500"
      case "success":
        return "border-l-green-500"
      default:
        return "border-l-blue-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "VERIFICADA":
        return "text-green-600 bg-green-50"
      case "VENCIDA":
        return "text-red-600 bg-red-50"
      case "PENDIENTE":
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  return (
    <div className="max-w-full mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FolderClock className="w-6 h-6 text-gray-700" />
              <h1 className="text-xl font-semibold text-gray-900">Notificaciones Próximas a Vencer</h1>
            </div>
          </div>
        </div>

        {viewMode === "cards" ? (
          <div className="divide-y divide-gray-100">
            {currentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${getBorderColor(notification.type)} ${
                  !notification.read ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                    </div>
                    <p className={`mt-1 text-sm ${!notification.read ? "text-gray-800" : "text-gray-600"}`}>
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número de notificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha notificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado notificación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Menú de Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentNotifications.map((notification) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.notificationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.expirationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {notification.notificationDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                        {notification.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button className="text-blue-900 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Anterior
                </button>

                <span className="text-sm text-gray-600 font-medium">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-blue-900 text-white hover:bg-blue-800"
                  }`}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="text-sm text-gray-500">
                Mostrando {startIndex + 1} a {Math.min(endIndex, notifications.length)} de {notifications.length} notificaciones
              </div>
            </div>
          </div>
        )}

        {currentNotifications.length === 0 && (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay notificaciones</h3>
            <p className="text-gray-500">Cuando tengas nuevas notificaciones aparecerán aquí.</p>
          </div>
        )}
      </div>

      {/* Tabla de Notificaciones Separada */}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">  
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Lista de Notificaciones</h2>
            <div className="flex items-center space-x-2">
              <select className="border border-gray-300 rounded-lg px-3 py-1 text-sm text-gray-600">
                <option>Filtros</option>
                <option>Fecha</option>
                <option>Apellido del Inspector</option>
                <option>Numero del Inspector</option>
                <option>Nombre de Fantasia Comercio</option>
                <option>Razon Social Comercio</option>
                <option>Numero de Notificacion</option>
              <option>Numero de Acta</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg hover:bg-yellow-500 transition-colors">
                Buscar
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número de notificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimiento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha notificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado notificación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Menú
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.slice(0, 8).map((notification) => (
                <tr key={`table-${notification.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.notificationNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.expirationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {notification.notificationDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                      {notification.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-900 hover:text-blue-700">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              Página 1 de 100
            </button>
            <button className="flex items-center px-4 py-2 text-sm font-medium bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors">
              »
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Notifications