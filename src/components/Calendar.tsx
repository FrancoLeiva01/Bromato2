"use client"

import type React from "react"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarEvent {
  id: string
  title: string
  date: number
  type: "notification" | "inspection" | "meeting"
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8)) // September 2025

  const events: CalendarEvent[] = [
    { id: "2025-3221", title: "2025-3221", date: 1, type: "notification" },
    { id: "2025-3371", title: "2025-3371", date: 1, type: "notification" },
    { id: "2025-3069", title: "2025-3069", date: 2, type: "notification" },
    { id: "2025-3183", title: "2025-3183", date: 2, type: "notification" },
    { id: "2025-3047", title: "2025-3047", date: 9, type: "notification" },
    { id: "2025-3161", title: "2025-3161", date: 10, type: "notification" },
  ]

  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]

  const dayNames = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"]

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = events.filter((event) => event.date === day)
      const isToday =
        new Date().getDate() === day &&
        new Date().getMonth() === currentDate.getMonth() &&
        new Date().getFullYear() === currentDate.getFullYear()

      days.push(
        <div key={day} className={`h-24 border border-gray-200 p-1 ${isToday ? "bg-yellow-50" : "bg-white"}`}>
          <div className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-900"}`}>{day}</div>
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
        </div>,
      )
    }

    return days
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Calendario de Notificaciones</h2>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <button
              onClick={goToToday}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
            >
              Hoy
            </button>

            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 text-center">
          {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-7 gap-0 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-3 text-center font-medium text-gray-700 bg-gray-50 border border-gray-200">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 border-l border-t border-gray-200">{renderCalendarDays()}</div>
      </div>
    </div>
  )
}

export default Calendar
