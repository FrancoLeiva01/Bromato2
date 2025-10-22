"use client"

import { useState, useEffect } from "react"
import { notificationRepository } from "../repositories/notificationRepository"
import type { Notification, Inspector } from "../types/notifications.type"

export const useInspector = () => {

const [loading, setLoading] = useState(false)


  const [inspectores, setInspectores] = useState<Inspector[]>([])
  const [allInspector, setAllInspector] = useState<Inspector[]>([])


  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 5;


  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notificationToEdit, setNotificationToEdit] =
  useState<Notification | null>(null);


  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalNotifications, setTotalNotifications] = useState(0);


  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)


  const [selectedNotification, setSelectedNotification] =
  useState<Notification | null>(null);


  const [error, setError] = useState<string | null>(null)

  
  useEffect(() => {
    fetchInspectores()
  }, [currentPage])

  
  const fetchInspectores = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await notificationRepository.getNotifications(currentPage)
      const items = (response as any).inspectores ?? (response as any).data ?? response
      setInspectores(items)
      setTotalPages(Math.ceil(((response as any).total || 0) / 10))
    } catch (err: any) {
      setError(err.message || "Error al cargar inspectores")
      console.error("Error fetching inspectores:", err)
    } finally {
      setLoading(false)
    }
  }

  const createNotification = async (data: any) => {
    try {
      setLoading(true)
      await notificationRepository.createNotification(data)
      await fetchInspectores() 
      setIsCreateModalOpen(false) 
    } catch (err: any) {
      setError(err.message || "Error al crear una Notificacion")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateNotification = async (id: number, data: any) => {
    try {
      setLoading(true)
      await notificationRepository.updateNotification(id, data)
      await fetchInspectores() 
    } catch (err: any) {
      setError(err.message || "Error al actualizar inspector")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteNotification = async (id: number) => {
    try {
      setLoading(true)
      await notificationRepository.deleteNotification(id)
      await fetchInspectores()
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
     const response = await notificationRepository.getNotifications(id)
      const notifications =
        (response as any).notifications?.[0] ??
        (response as any).data?.[0] ??
        (response as any).notificationses ??
        (response as any).data ??
        response
      setSelectedNotification(notifications as Notification | null)
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

    // Modals
    isCreateModalOpen,
    setIsCreateModalOpen,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedNotification,

    // Acciones
    fetchInspectores,
    createNotification,
    updateNotification,
    deleteNotification,
    viewDetails,
  }
}
