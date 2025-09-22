import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./layouts/Layout"
import Calendar from "./components/Calendar"
import Login from "./modules/Auth/views/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"
import Notifications from "./components/Notifications"
import ActasInspeccion from "./components/ActasInspeccion"
import ActasComprobacion from "./components/ActasComprobacion"
import Rubros from "./components/Rubros"
import Comercios from "./components/Comercios"
import Inspectores from "./components/Inspectores"

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
        theme="light"
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
        <Route path="/" element={<Navigate to="/home" replace />} />
      </Routes>
    </>
  )
}

export default App
