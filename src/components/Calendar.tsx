import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Datos de ejemplo para las notificaciones
const notificationsData = {
  1: [
    { id: '2025-3221', type: 'red', text: '2025-3221' },
    { id: '2025-3371', type: 'red', text: '2025-3371' },
    { id: '2025-3412', type: 'red', text: '2025-3412' },
    { id: '2025-3413', type: 'red', text: '2025-3413' }
  ],
  2: [
    { id: '2025-3069', type: 'green', text: '2025-3069' },
    { id: '2025-3183', type: 'green', text: '2025-3183' },
    { id: '2025-3208', type: 'green', text: '2025-3208' },
    { id: '2025-3467', type: 'green', text: '2025-3467' }
  ],
  3: [
    { id: '2025-1988', type: 'red', text: '2025-1988' },
    { id: '2025-3276', type: 'red', text: '2025-3276' },
    { id: '2025-3418', type: 'red', text: '2025-3418' },
    { id: '2025-3465', type: 'red', text: '2025-3465' }
  ],
  4: [
    { id: '2025-2980', type: 'red', text: '2025-2980' },
    { id: '2025-3202', type: 'red', text: '2025-3202' },
    { id: '2025-3278', type: 'red', text: '2025-3278' },
    { id: '2025-3384', type: 'red', text: '2025-3384' },
    { id: '2025-3381', type: 'red', text: '2025-3381' },
    { id: '2025-3382', type: 'red', text: '2025-3382' },
    { id: '2025-3390', type: 'red', text: '2025-3390' },
    { id: '2025-3466', type: 'red', text: '2025-3466' }
  ],
  5: [
    { id: '2025-1997', type: 'red', text: '2025-1997' },
    { id: '2025-3238', type: 'red', text: '2025-3238' },
    { id: '2025-3239', type: 'red', text: '2025-3239' },
    { id: '2025-3306', type: 'red', text: '2025-3306' },
    { id: '2025-3383', type: 'red', text: '2025-3383' },
    { id: '2025-3482', type: 'red', text: '2025-3482' }
  ],
  9: [
    { id: '2025-3473', type: 'red', text: '2025-3473' },
    { id: '2025-3491', type: 'red', text: '2025-3491' },
    { id: '2025-3495', type: 'green', text: '2025-3495' }
  ],
  10: [
    { id: '2025-3047', type: 'blue', text: '2025-3047' },
    { id: '2025-3401', type: 'blue', text: '2025-3401' },
    { id: '2025-3429', type: 'blue', text: '2025-3429' },
    { id: '2025-3515', type: 'blue', text: '2025-3515' }
  ],
  11: [
    { id: '1927', type: 'blue', text: '1927' },
    { id: '2025-2424', type: 'blue', text: '2025-2424' },
    { id: '2025-3178', type: 'blue', text: '2025-3178' }
  ],
  12: [
    { id: '2025-2749', type: 'blue', text: '2025-2749' },
    { id: '2025-3186', type: 'blue', text: '2025-3186' },
    { id: '2025-3286', type: 'blue', text: '2025-3286' },
    { id: '2025-3391', type: 'blue', text: '2025-3391' },
    { id: '2025-3392', type: 'blue', text: '2025-3392' },
    { id: '2025-3434', type: 'blue', text: '2025-3434' },
    { id: '2025-3532', type: 'blue', text: '2025-3532' }
  ]
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)); // Septiembre 2025

  // Obtener información del mes actual
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  
  // Primer día del mes y cuántos días tiene
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Día de la semana en que empieza el mes (0 = domingo, 1 = lunes, etc.)
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Ajustar para que lunes sea 0
  
  // Crear array de días
  const days = [];
  
  // Días vacíos al principio
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'red':
        return 'bg-red-500 text-white';
      case 'green':
        return 'bg-green-500 text-white';
      case 'blue':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Calendario de Notificaciones
        </h1>
        
        {/* Controles de navegación */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors border border-gray-300"
            >
              <ChevronRight size={20} />
            </button>
            <button 
              onClick={goToToday}
              className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-800 rounded-md transition-colors font-medium ml-2"
            >
              Hoy
            </button>
          </div>
        </div>
        
        <h2 className="text-2xl font-medium text-gray-700 capitalize text-center mb-6">
          {monthName}
        </h2>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 max-w-full">
        {/* Headers de días de la semana */}
        {['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map((dayName) => (
          <div key={dayName} className="text-center p-3 font-medium text-gray-600 bg-gray-50 border">
            {dayName}
          </div>
        ))}

        {/* Días del calendario */}
        {days.map((day, index) => (
          <div
            key={index}
            className={`min-h-[140px] border border-gray-200 p-2 ${
              day ? 'bg-white' : 'bg-gray-50'
            }`}
          >
            {day && (
              <>
                <div className="font-semibold text-sm text-gray-800 mb-2">
                  {day}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[100px]">
                  {notificationsData[day as keyof typeof notificationsData]?.map((notification) => (
                    <div
                      key={notification.id}
                      className={`text-xs px-2 py-1 rounded text-center font-medium ${getNotificationColor(notification.type)}`}
                    >
                      {notification.text}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}