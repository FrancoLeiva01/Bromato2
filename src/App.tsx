import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import "./index.css";
import Layout from "./layouts/Layout"; // 👈 importás el Layout

function App() {
  const [events] = useState([
    { title: "2025-3221", date: "2025-09-01" },
    { title: "2025-3371", date: "2025-09-01" },
    { title: "2025-3069", date: "2025-09-02" },
    { title: "2025-3183", date: "2025-09-02" },
    { title: "2025-3047", date: "2025-09-10" },
    { title: "2025-3401", date: "2025-09-10" },
  ]);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">
          Calendario de Notificaciones
        </h2>

        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          events={events}
          height="auto"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "",
          }}
          eventContent={(eventInfo) => (
            <div
              className="text-white text-xs rounded px-1 py-0.5 font-medium mb-0.5 block w-full"
              style={{
                backgroundColor:
                  eventInfo.event.extendedProps.color || "#27ae60",
              }}
            >
              {eventInfo.event.title}
            </div>
          )}
        />
      </div>
    </Layout>
  );
}

export default App;
