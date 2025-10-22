import { FolderClock, TriangleAlert, Bell } from "lucide-react";
import type { Notification } from "../types/notifications.type";

interface UpcomingNotificationsProps {
  notifications: Notification[];
}

export const UpcomingNotifications: React.FC<UpcomingNotificationsProps> = ({
  notifications,
}) => {
  return (
    <div
      className="bg-gray-200 rounded-lg border border-gray-200 shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600"
      style={{
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
      }}
    >
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FolderClock className="w-6 h-6 text-blue-700" />
           <h1>Notificaciones proximas a vencer</h1>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={`preview-${notification.id}`}
              className="mb-1 p-6 hover:bg-orange-200 transition-colors border-l-4 border-l-red-600 bg-gray-100 rounded-lg"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  <TriangleAlert className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="capitalize mt-1 text-sm text-gray-800">
                    {notification.detalle_notificacion}
                    </p>
                    <h3 className="text-sm font-medium text-gray-900">
                      {notification.tipo_infraccion.join(", ")}
                    </h3>
                    <span className="text-xs text-gray-500">
                   {notification.fecha_vencimiento}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
           <p>Sin Notificaciones proximas a vencer</p>
          </div>
        )}
      </div>
    </div>
  );
};