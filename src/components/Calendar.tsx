import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent"

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  type: "notification" | "inspection" | "meeting";
}

const Calendar: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const events: CalendarEvent[] = [
    { id: "2025-3221", title: "2025-3221", date: 1, type: "notification" },
    { id: "2025-3371", title: "2025-3371", date: 1, type: "notification" },
    { id: "2025-3069", title: "2025-3069", date: 2, type: "notification" },
    { id: "2025-3183", title: "2025-3183", date: 2, type: "notification" },
    { id: "2025-3047", title: "2025-3047", date: 9, type: "notification" },
    { id: "2025-3161", title: "2025-3161", date: 10, type: "notification" },
  ];

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border-gray-200"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter((event) => event.date === day);
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`h-28 border border-gray-300 p-1 ${
            isToday
              ? "bg-gradient-to-b from-orange-400 to-gray-100 h-40 w-full"
              : "bg-gradient-to-b from-gray-100 to-white h-40 w-full"
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-black-500" : "text-gray-900"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="text-xs bg-green-500 text-white px-2 py-1 rounded truncate"
                title={event.title}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
     <LoaderContent isLoading={isLoading} loadingText="Cargando Inicio..." minHeight="400px">

    <div className="bg-slate-500 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600 border border-gray-500 ">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-bold text-white">
            Calendario de Notificaciones
          </h2>

          <div className="flex items-center space-x-2 rounded">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-400 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={goToToday}
              className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
            >
              Hoy
            </button>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-400 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-white text-center">
          {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-0 mb-4">
          {dayNames.map((day) => (
            <div
              key={day}
              className="p-3 text-center font-medium text-gray-700 bg-gray-50 border border-gray-200"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 border-l border-t border-gray-200">
          {renderCalendarDays()}
        </div>
      </div>
    </div>

     </LoaderContent>
  );
};

export default Calendar;
