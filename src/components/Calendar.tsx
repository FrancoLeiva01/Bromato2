import type React from "react";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar1 } from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent";

interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  type: "notification" | "inspection" | "meeting";
}

const Calendar: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const events: CalendarEvent[] = [
    { id: "2025-3221", title: "2025-3221", date: 1, type: "notification" },
    { id: "2025-3371", title: "2025-3371", date: 1, type: "notification" },
    { id: "2025-3069", title: "2025-3069", date: 2, type: "notification" },
    { id: "2025-3183", title: "2025-3183", date: 2, type: "notification" },
    { id: "2025-3047", title: "2025-3047", date: 9, type: "notification" },
    { id: "2025-3161", title: "2025-3161", date: 10, type: "notification" },
  ];

  const monthNames = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
  ];

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const getDaysInMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      direction === "prev"
        ? newDate.setMonth(prev.getMonth() - 1)
        : newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => setCurrentDate(new Date());

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border-gray-200"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter((event) => event.date === day);
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear();

      days.push(
        <div
          key={day}
          className={`border border-gray-300 p-1 flex flex-col 
          items-start justify-start 
          min-w-[120px] sm:min-w-[140px] md:min-w-[160px] 
          h-[100px] sm:h-[120px] md:h-[140px]
          ${
            isToday
              ? "bg-gradient-to-b from-orange-400 to-gray-100"
              : "bg-gradient-to-b from-gray-100 to-white"
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-black" : "text-gray-900"
            }`}
          >
            {day}
          </div>
          <div className="space-y-1 w-full">
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
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Inicio..."
      minHeight="400px"
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-800 p-4 sm:p-8 rounded-lg">
        <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 p-6 rounded-2xl shadow-2xl border border-slate-600/50 backdrop-blur-sm">
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row justify-center items-center text-center sm:text-left gap-4">
            <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/30">
              <Calendar1 className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-500" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              Calendario de Notificaciones
            </h1>
          </div>

          {/* CONTROLES DE NAVEGACIÓN */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-6">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-500/40 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>

            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-white text-center min-w-[200px]">
              {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
            </h3>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-500/40 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <button
              onClick={goToToday}
              className="px-3 py-1 sm:px-4 sm:py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-600 transition-colors text-xs sm:text-sm font-medium"
            >
              Hoy
            </button>
          </div>

          {/* CALENDARIO */}
          <div className="p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[840px]">
              <div className="grid grid-cols-7 gap-0 mb-2">
                {dayNames.map((day) => (
                  <div
                    key={day}
                    className="p-2 text-center font-medium text-gray-700 bg-gray-50 border border-gray-200 text-xs sm:text-sm"
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
        </div>
      </div>
    </LoaderContent>
  );
};

export default Calendar;
