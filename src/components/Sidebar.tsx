import type React from "react";
import { useState } from "react";
import logoMunicipalidad from "../assets/logo_CATACAPI_color.png";
import {
  ChevronDown,
  ChevronRight,
  FileCheck,
  ClipboardCheck,
  Home,
  ClipboardList,
  Tag,
  Store,
  UserCheck,
  FolderOpen,
  X,
  Users,
  BellRing
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const [isDocumentosOpen, setIsDocumentosOpen] = useState(false);
  const [isPrecargadosOpen, setIsPrecargadosOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Inicio", path: "/home" },
    {
      icon: ClipboardList,
      label: "Pre-Cargados",
      path: "/precargados",
      hasDropdown: true,
      subItems: [
        { icon: Tag, label: "Rubros", path: "/rubros" },
        { icon: Store, label: "Grandes Contribuyentes", path: "/grandes-contribuyentes" },
        { icon: UserCheck, label: "Inspectores", path: "/inspectores" },
      ],
    },
    {
      icon: FolderOpen,
      label: "Documentos",
      path: "/documentos",
      hasDropdown: true,
      subItems: [
        {
          icon: FileCheck,
          label: "Actas de inspección",
          path: "/actas-inspeccion",
        },
        {
         icon: BellRing,
         label: "Notificaciones",
         path: "/notifications",
       },
        {
          icon: ClipboardCheck,
          label: "Actas de comprobación",
          path: "/actas-comprobacion",
        },
      ],
    },
    { icon: Users, label: "Usuarios", path: "/usuarios" },
  ];

  const handleDocumentosClick = () => {
    setIsDocumentosOpen(!isDocumentosOpen);
  };

  const handlePrecargadosClick = () => {
    setIsPrecargadosOpen(!isPrecargadosOpen);
  };

  const handleLinkClick = () => {
    if (onClose && window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        w-64 bg-gradient-to-b from-slate-800 to-slate-600 text-white min-h-screen shadow-lg
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-screen w-64 shadow-slate-500 p-8 ">
          <div className="flex items-center justify-between mb-8 ">
            <div className="flex items-center space-x-3 font-semibold">
              <img
                src={logoMunicipalidad || "/placeholder.svg"}
                alt="logoMunicipalidad"
                className="max-h-20 ml-3"
              />
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors pl-8"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              if (item.hasDropdown) {
                const isOpen =
                  item.label === "Documentos"
                    ? isDocumentosOpen
                    : isPrecargadosOpen;
                const handleClick =
                  item.label === "Documentos"
                    ? handleDocumentosClick
                    : handlePrecargadosClick;

                return (
                  <div key={index}>
                    <button
                      onClick={handleClick}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        isActive ||
                        item.subItems?.some(
                          (sub) => location.pathname === sub.path
                        )
                          ? "bg-blue-500 text-white"
                          : "text-white hover:to-blue-700 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center space-x-3 ">
                        <Icon className="w-6 h-6" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    {isOpen && item.subItems && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.subItems.map((subItem, subIndex) => {
                          const SubIcon = subItem.icon;
                          const isSubActive =
                            location.pathname === subItem.path;
                          return (
                            <Link
                              key={subIndex}
                              to={subItem.path}
                              onClick={handleLinkClick}
                              className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                                isSubActive
                                  ? "bg-teal-600 text-white"
                                  : "text-white hover:bg-slate-700 hover:text-white"
                              }`}
                            >
                              <SubIcon className="w-5 h-5" />
                              <span className="text-sm font-medium">
                                {subItem.label}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={index}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-white hover:bg-slate-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
