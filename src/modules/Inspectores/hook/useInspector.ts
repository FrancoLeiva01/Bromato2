"use client"

import { useState, useEffect } from "react"
import { inspectorRepository } from "../repositories/inspectorRepository"
import type { Inspector } from "../types/inspector.types"

export const useInspector = () => {
  const [inspectores, setInspectores] = useState<Inspector[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedInspector, setSelectedInspector] = useState<Inspector | null>(null)
  useEffect(() => {
    fetchInspectores()
  }, [currentPage])

  const fetchInspectores = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await inspectorRepository.getInspectores(currentPage)
      const items = (response as any).inspectores ?? (response as any).data ?? response
      setInspectores(items)
      setTotalPages(Math.ceil(((response as any).total || 0) / 10))
    } catch (err: any) {
      setError(err.message || "Error al cargar inspectores")
      console.error("[v0] Error fetching inspectores:", err)
    } finally {
      setLoading(false)
    }
  }

  const createInspector = async (data: any) => {
    try {
      setLoading(true)
      await inspectorRepository.createInspector(data)
      await fetchInspectores() 
      setIsCreateModalOpen(false) 
    } catch (err: any) {
      setError(err.message || "Error al crear inspector")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateInspector = async (id: number, data: any) => {
    try {
      setLoading(true)
      await inspectorRepository.updateInspector(id, data)
      await fetchInspectores() 
    } catch (err: any) {
      setError(err.message || "Error al actualizar inspector")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteInspector = async (id: number) => {
    try {
      setLoading(true)
      await inspectorRepository.deleteInspector(id)
      await fetchInspectores() // Recargar lista
    } catch (err: any) {
      setError(err.message || "Error al eliminar inspector")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const viewDetails = async (id: number) => {
    try {
      setLoading(true)
      const response = await inspectorRepository.getInspectores(id)
      const inspector =
        (response as any).inspectores?.[0] ??
        (response as any).data?.[0] ??
        (response as any).inspectores ??
        (response as any).data ??
        response

      setSelectedInspector(inspector as Inspector | null)
      setIsDetailsModalOpen(true)
    } catch (err: any) {
      setError(err.message || "Error al cargar detalles")
    } finally {
      setLoading(false)
    }
  }
  return {
    // Datos
    inspectores,
    loading,
    error,

    // Paginación
    currentPage,
    totalPages,
    setCurrentPage,

    // Modales
    isCreateModalOpen,
    setIsCreateModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedInspector,

    // Acciones
    fetchInspectores,
    createInspector,
    updateInspector,
    deleteInspector,
    viewDetails,
  }
}
