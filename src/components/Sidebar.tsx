import { Home, FileText, Settings } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-[#1c3557] text-white h-screen p-4 flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="bg-blue-900 rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
            CC
          </div>
          <div>
            <h2 className="text-sm font-bold">Catamarca Capital</h2>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-3">
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white-700 hover:bg-white-600 transition"
        >
          <Home className="w-4 h-4" />
          Inicio
        </a>
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <FileText className="w-4 h-4" />
          Documentos
        </a>
        <a
          href="#"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          <Settings className="w-4 h-4" />
          Precargados
        </a>
      </nav>
    </aside>
  );
}
