import { Eye, EyeOff, User, Lock, Mail, Shield } from "lucide-react"
import { useState } from "react"
// import { useRegisterFormik } from "../formik/useRegisterFormik"

interface RegisterValues {
  username: string
  email: string
  password: string
  role: string
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [role, setRole] = useState("")

  // const useRegister = useRegisterFormik();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-blue-400 to-slate-800 flex items-center justify-center p-4 rounded-lg">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src="/src/assets/logo-municipalidad.png" alt="Logo Municipalidad" className="h-24 w-24" />
              <div className="text-left">
                <h2 className="font-bold text-3xl text-gray-800">Catamarca</h2>
                <p className="text-xl text-slate-600">Capital</p>
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Registro - Bromatología</h1>
          <p className="text-gray-600">Catamarca Capital</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="username"
                // value={useRegister.values.username}
                // onChange={useRegister.handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ingrese su nombre de usuario"
              />
            </div>
          </div>

          {/* Campo Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                // value={useRegister.values.email}
                // onChange={useRegister.handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="usuario@ejemplo.com"
              />
            </div>
          </div>

          {/* Campo Contraseña */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                // value={useRegister.values.password}
                // onChange={useRegister.handleChange}
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

          {/* Campo Rol */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors appearance-none bg-white text-gray-400" 
              >
                <option value="">Seleccione un rol</option>
                <option value="administrador">Administrador</option>
                <option value="visualizador">Visualizador</option>
                <option value="gestor_datos">Digitalizador</option>
              </select>
            </div>
          </div>

          <button
            // onClick={() => useRegister.handleSubmit()}
            disabled={isSubmitting}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Crear Cuenta"
            )}
          </button>
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            <strong>Crea tu cuenta del sistema</strong>
            <br />
            Completa todos los campos para registrarte
          </p>

          <button

           className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-2 px-2 rounded-lg transition-colors duration-200 flex items-center justify-center mt-4">
            ¿Ya tienes cuenta? Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  )
}

export default Register
