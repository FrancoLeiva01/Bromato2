"use client"

import { useState } from "react"
import { UserCheck } from "lucide-react"
import { LoaderContent } from "@/components/LoaderComponent"
import { useInspector } from "@/modules/Inspectores/hook/useInspector"
import InspectorTable from "../components/InspectorTable"
import CreateFormInspector from "../components/CreateFormInspector"
import { InspectorDetailsModal } from "@/modules/Inspectores/components/InspectorDetailModal"
import type { Inspector } from "@/modules/Inspectores/types/inspector.types"

const Inspectores = () => {
  const {
    inspectores,
    loading: isLoading,
    currentPage,
    totalPages,
    setCurrentPage,
  } = useInspector()


  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null)
  const [filterType, setFilterType] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")


  const handleCreateInspector = async (data: any) => {
    console.warn("create inspector handler not provided by hook", data)
    return Promise.resolve()
  }

  const handleUpdateInspector = async (id: number, data: any) => {
    console.warn("update inspector handler not provided by hook", id, data)
    return Promise.resolve()
  }

  const handleToggleActivo = (inspector: Inspector) => {
    console.warn("toggle activo handler not provided by hook", inspector)
  }

  const handleDeleteInspector = async (id: number) => {
    console.warn("delete inspector handler not provided by hook", id)
    return Promise.resolve()
  }

  // 🎭 Estado local: Control de modales (solo UI)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [inspectorToEdit, setInspectorToEdit] = useState < Inspector | null>(null)

  // 📄 Handlers de paginación
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  // 👁️ Handler: Ver detalles
  const handleViewDetails = (inspector: Inspector) => {
    setSelectedInspector(inspector)
    setIsDetailsModalOpen(true)
  }

  // ➕ Handler: Abrir formulario para crear
  const handleNewInspector = () => {
    setInspectorToEdit(null)
    setIsFormOpen(true)
  }

  // ✏️ Handler: Abrir formulario para editar
  const handleEditClick = (inspector: Inspector) => {
    setInspectorToEdit(inspector)
    setIsFormOpen(true)
  }

  // 📤 Handler: Submit del formulario (crear o editar)
  const handleFormSubmit = async (data: any) => {
    if (inspectorToEdit) {
      // Modo edición
      return await handleUpdateInspector(inspectorToEdit.id, data)
    } else {
      // Modo creación
      return await handleCreateInspector(data)
    }
  }

  return (
    <LoaderContent isLoading={isLoading} loadingText="Cargando Inspectores..." minHeight="400px">
      <>
        {/* 📌 SECCIÓN: Título */}
        <div className="mb-6">
          <div className="bg-slate-800 rounded-lg p-4 flex justify-center items-center">
            <UserCheck className="w-8 h-8 text-blue-500 mr-2" />
            <h1 className="text-3xl font-bold text-white text-center">Inspectores</h1>
          </div>
        </div>

        {/* 📊 COMPONENTE: Tabla de inspectores */}
        <InspectorTable
          inspectores={inspectores}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onViewDetails={handleViewDetails}
          onEdit={handleEditClick}
          onDelete={handleDeleteInspector}
          onToggleActivo={handleToggleActivo}
          onNewInspector={handleNewInspector}
          filterType={filterType}
          setFilterType={setFilterType}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={() => setCurrentPage(1)}
        />

        {/* 👁️ COMPONENTE: Modal de detalles */}
        <InspectorDetailsModal
          inspector={selectedInspector}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false)
            setSelectedInspector(null)
          }}
        />

        {/* 📝 COMPONENTE: Formulario crear/editar */}
        {isFormOpen && (
          <CreateFormInspector
            onClose={() => {
              setIsFormOpen(false)
              setInspectorToEdit(null)
            }}
            onSubmit={handleFormSubmit}
            inspector={inspectorToEdit}
          />
        )}
      </>
    </LoaderContent>
  )
}

export default Inspectores
