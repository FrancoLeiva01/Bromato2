"use client"

import { Facebook, Instagram, Youtube, MapPin, Twitter } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logoMunicipalidad from "../assets/logo-municipalidad.png"

const Footer = () => {
  const navigate = useNavigate()

  const handleMapClick = () => {
    navigate("/mapa")
  }

  return (
    <footer className="bg-gradient-to-r from-slate-700 to-slate-900 text-white mt-auto ">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
           {/* Logo */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center space-x-3">
              <img src={logoMunicipalidad || "/placeholder.svg"} alt="logoMunicipalidad" className="max-h-20 ml-3" />
              <div>
                <h2 className="font-bold text-lg">Catamarca</h2>
                <p className="text-sm text-slate-300">Capital</p>
              </div>
            </div>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Sistema de gestión municipal para el área de bromatología y control de alimentos.
            </p>
          </div>

          {/* Enlaces institucionales */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-lg mb-4">Institucional</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Acerca de nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Misión y visión
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Autoridades
                </a>
              </li>
            </ul>
          </div>

          {/* Enlaces de servicios */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-lg mb-4">Servicios</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Trabaja con nosotros
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Mesa de ayuda
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Denuncias
                </a>
              </li>
              <li>
                <button
                  onClick={handleMapClick}
                  className="flex items-center gap-2 text-green-100 hover:text-white transition-colors duration-200 text-sm bg-transparent border-none cursor-pointer p-0"
                >
                  <MapPin size={16} />
                  Mapa Mapin Mapita
                </button>
              </li>
            </ul>
          </div>

          {/* Redes sociales y politicas */}
          <div className="md:col-span-1">
            <h4 className="font-semibold text-lg mb-4">Seguinos</h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://www.facebook.com/catamarcatucapital"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-500 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://x.com/MuniSFVC"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-500 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Twitter size={20} />
              </a>
              <a
                href="https://www.instagram.com/catamarcacapital/#"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-500 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.youtube.com/channel/UCMAeIcE5sQa7chR-J13zlDw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-emerald-500 hover:bg-gray-400 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Youtube size={20} />
              </a>
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Políticas de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="text-green-100 hover:text-white transition-colors duration-200 text-sm">
                  Términos y condiciones
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria y copyright */}
        <div className="border-t border-green-700 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-100 text-sm">
              © 2025 Municipalidad de Catamarca Capital. Todos los derechos reservados.
            </p>
            <p className="text-green-200 text-xs">Sistema de Bromatología Municipal v1.0</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
