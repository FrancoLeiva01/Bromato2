import { Routes, Route, Navigate } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"

import Calendar from "./components/Calendar"
import Notifications from "./pages/Notifications"
import ActasInspeccion from "./pages/ActasInspeccion"
import ActasComprobacion from "./pages/ActasComprobacion"
import Rubros from "./pages/Rubros"
import Comercios from "./pages/Comercios"
import Inspectores from "./pages/Inspectores"
import Register from "./pages/Register"
import MapComponent from "./pages/MapComponent"
import Usuarios from "./pages/Usuarios"

import Login from "./modules/Auth/views/Login"
import Layout from "./layouts/Layout"
// import ProtectedRoute from "./components/ProtectedRoute"


function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/home"
          element={
            //<ProtectedRoute>
              <Layout>
                <Calendar />
              </Layout>
            //</ProtectedRoute>
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/notifications"
          element={
            //<ProtectedRoute>
              <Layout>
                <Notifications />
              </Layout>
            //</ProtectedRoute>
          }
        />
        <Route
          path="/actas-inspeccion"
          element={
            //<ProtectedRoute>
              <Layout>
                <ActasInspeccion />
              </Layout>
            //</ProtectedRoute>
          }
        />
        <Route
          path="/actas-comprobacion"
          element={
            //<ProtectedRoute>
              <Layout>
                <ActasComprobacion />
              </Layout>
            //</ProtectedRoute>
          }
        />
        <Route
          path="/rubros"
          element={
            //<ProtectedRoute>
              <Layout>
                <Rubros />
              </Layout>
            //</ProtectedRoute>
          }
        />
        <Route
          path="/comercios"
          element={
            //<ProtectedRoute>
              <Layout>
                <Comercios />
              </Layout>
            //</ProtectedRoute>
          }
        />
        <Route
          path="/inspectores"
          element={
            //<ProtectedRoute>
              <Layout>
                <Inspectores />
              </Layout>
            //</ProtectedRoute>
          }
        />
         <Route
          path="/mapa"
          element={
            //<ProtectedRoute>
              <Layout>
                <MapComponent />
              </Layout>
            //</ProtectedRoute>
          }
        />
         <Route 
        path="/usuarios" 
        element={
          // <ProtectedRoute requiredRole="administrador">
            <Layout>
            <Usuarios />
            </Layout>
          // </ProtectedRoute>
        } 
      />
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

export default App
