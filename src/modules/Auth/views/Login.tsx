import { Eye, EyeOff, User, Lock } from "lucide-react"
import { useState } from "react"
import { useLoginFormik } from "../formik/useLoginFormik"
import { useNavigate } from "react-router-dom"

interface LoginValues {
  email: string
  password: string
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)  
  const useLogin = useLoginFormik();

  // Navigate al Register
  const navigate = useNavigate();
  const handleCreateClick = () => {
    navigate("/register")
    console.log("Navigate ejecutado")
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/src/assets/bromato.png')" }} // 👈 cambiá "mi-fondo.jpg" por tu imagen
    >
      {/* Fondo semitransparente para mejor contraste */}
      <div className="bg-slate-600 rounded-2xl shadow-2xl w-full max-w-md p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src="/src/assets/logo-municipalidad.png" alt="Logo Municipalidad" className="h-24 w-24" />
              <div className="text-left">
                <h2 className="font-bold text-3xl text-white">Catamarca</h2>
                <p className="text-xl text-gray-200">Capital</p>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Administración de Bromatología</h1>
          <p className="text-white">Catamarca Capital</p>
        </div>

        <div className="space-y-6">
          {/* Campo Usuario */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
              Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                value={useLogin.values.email}
                onChange={useLogin.handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Usuario@ejemplo.com"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={useLogin.values.password}
                onChange={useLogin.handleChange}
                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingrese su contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            onClick={() => useLogin.handleSubmit()}
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
        </div>

        {/* Información de prueba */}
        <div className="mt-6 p-7 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Usa tus credenciales del sistema</strong>
            <br />
            Email y contraseña proporcionados por el administrador
          </p>

          <button 
            onClick={handleCreateClick}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400 text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-200 flex items-center justify-center mt-8"
          >
            No tienes una cuenta? Creala aqui
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
