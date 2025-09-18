"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"

interface Notification {
  id: string
  type: "inspection" | "permit" | "renewal"
}

type NotificationsRecord = Record<string, Notification[]>

const MONTHS = [
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

const DAYS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"]

const notifications: NotificationsRecord = {
  "2025-09-01": [
    { id: "2025-3221", type: "inspection" },
    { id: "2025-3371", type: "permit" },
  ],
  "2025-09-02": [
    { id: "2025-3069", type: "inspection" },
    { id: "2025-3183", type: "renewal" },
  ],
  "2025-09-09": [{ id: "2025-3047", type: "inspection" }],
  "2025-09-10": [{ id: "2025-3161", type: "permit" }],
}

export function NotificationCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 1)) // Septiembre 2025

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7 // Ajustar para que lunes sea 0
  const daysInMonth = lastDayOfMonth.getDate()

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const renderCalendarDay = (day: number) => {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    const dayNotifications = notifications[dateKey] || []
    const isToday = new Date().toDateString() === new Date(year, month, day).toDateString()

    return (
      <div
        key={day}
        className={`
          min-h-[90px] p-2 calendar-day relative
          ${isToday ? "calendar-today" : ""}
        `}
      >
        <div className={`font-semibold text-sm mb-2 ${isToday ? "text-accent font-bold" : "text-foreground"}`}>
          {day}
        </div>
        <div className="space-y-1 max-h-[60px] overflow-y-auto">
          {dayNotifications.map((notification: Notification) => (
            <div
              key={notification.id}
              className="calendar-event"
              title={`Notificación ${notification.id} - ${notification.type}`}
            >
              {notification.id}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full shadow-lg bg-white rounded-lg border border-gray-200">
      <div className="calendar-header p-6 pb-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            Calendario de Notificaciones
          </h1>

          <div className="flex items-center gap-1">
            <button
              onClick={goToPreviousMonth}
              className="h-9 w-9 p-0 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white bg-transparent transition-colors flex items-center justify-center"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              onClick={goToToday}
              className="px-4 h-9 border border-gray-300 rounded-md hover:bg-gray-100 hover:text-gray-900 font-medium bg-transparent transition-colors"
            >
              Hoy
            </button>

            <button
              onClick={goToNextMonth}
              className="h-9 w-9 p-0 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white bg-transparent transition-colors flex items-center justify-center"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-center py-2">
          <h2 className="text-xl font-semibold text-blue-600 capitalize">
            {MONTHS[month]} de {year}
          </h2>
        </div>
      </div>

      <div className="p-0">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-7">
            {DAYS.map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {/* Días vacíos al inicio del mes */}
            {Array.from({ length: firstDayWeekday }, (_, i) => (
              <div key={`empty-${i}`} className="min-h-[90px] calendar-empty" />
            ))}

            {/* Días del mes */}
            {Array.from({ length: daysInMonth }, (_, i) => renderCalendarDay(i + 1))}

            {/* Días vacíos al final del mes para completar la grilla */}
            {Array.from({ length: (7 - ((firstDayWeekday + daysInMonth) % 7)) % 7 }, (_, i) => (
              <div key={`empty-end-${i}`} className="min-h-[90px] calendar-empty" />
            ))}
          </div>
        </div>

        <div className="calendar-legend mx-4 mb-4">
          <div className="legend-item">
            <div className="legend-color bg-gray-100"></div>
            <span>Notificaciones pendientes</span>
          </div>
          <div className="legend-item">
            <div className="legend-color bg-yellow-100 border border-yellow-400"></div>
            <span>Día actual</span>
          </div>
          <div className="legend-item">
            <div className="legend-color bg-gray-50 border border-gray-200"></div>
            <span>Sin actividad</span>
          </div>
        </div>
      </div>
    </div>
  )
}
