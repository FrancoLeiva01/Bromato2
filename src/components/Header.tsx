import React from "react"

interface HeaderProps {
  username?: string
  backgroundImage?: string
}

const Header: React.FC<HeaderProps> = ({
  username = "Usuario",
  backgroundImage = "/src/assets/bromato.png",
}) => {
  return (
    <header
      className="w-full bg-cover bg-center mb-8 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col items-center justify-center text-center h-96 bg-black/50 rounded-lg ">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-green-400 drop-shadow-lg">
          Bienvenido {username}!
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl px-4">
          Al Sistema de Control y Seguridad alimentaria para proteger la salud de nuestra ciudad
        </p>
      </div>
    </header>
  )
}

export default Header
