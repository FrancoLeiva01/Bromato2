import { Eye, Edit, Trash2 } from "lucide-react";
import type { Notification } from "../types/notifications.type";

interface NotificationsTableProps {
  notifications: Notification[];
  onViewDetails: (notification: Notification) => void;
  onEdit: (notification: Notification) => void;
  onDelete: (id: number) => void;
}

export const NotificationsTable: React.FC<NotificationsTableProps> = ({
  notifications,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo Infracción
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fecha Notificación
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vencimiento
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inspector
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Opciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <tr key={`table-${notification.id}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notification.nro_notificacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notification.tipo_infraccion.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notification.fecha_notificacion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notification.fecha_vencimiento}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {notification.nombre_inspector}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                      onClick={() => onViewDetails(notification)}
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                      onClick={() => onEdit(notification)}
                      title="Editar notificación"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                      onClick={() => onDelete(notification.id)}
                      title="Eliminar notificación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="px-6 py-8 text-center text-sm text-gray-500"
              >
                No se encontraron Notificaciones
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};