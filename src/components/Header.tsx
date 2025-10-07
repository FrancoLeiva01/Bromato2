import React from "react";
import { useState, useEffect } from "react";
import { LoaderContent } from "@/components/LoaderComponent"


interface HeaderProps {
  username?: string;
  backgroundImage?: string;
}

const Header: React.FC<HeaderProps> = ({
  backgroundImage = "/src/assets/bromato.png",
}
) => {
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])



  
  return (
     <LoaderContent isLoading={isLoading} loadingText="Cargando..." minHeight="400px">

    <header
      className="w-full bg-cover bg-center mb-8 rounded-lg shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col items-center justify-center text-center h-96 bg-black/50 rounded-lg ">
        <h1 className="text-4xl md:text-6xl font-extrabold uppercase text-orange-400 drop-shadow-lg">
          {" "}
          {/* Para forzar la mayuscula */}
          Bienvenido!
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-200 max-w-2xl px-4">
          Al Sistema de Control y Seguridad alimentaria para proteger la salud
          de nuestra ciudad
        </p>
      </div>
    </header>


     </LoaderContent>
  );
};

export default Header;
