"use client";

import { FolderClock, ClipboardList } from "lucide-react";
import { LoaderContent } from "@/components/LoaderComponent";
import { useNotifications } from "../hook/useNotification";
import { NotificationsFilters } from "../components/NotificationsFilters";
import { NotificationsTable } from "../components/NotificationsTable";
import { Pagination } from "../components/Pagination";
import { UpcomingNotifications } from "../components/UpcomingNotifications";
import { CreateNotificationModal } from "../components/CreateNotificationModal";
import { EditNotificationModal } from "../components/EditNotificationModal";
import { ViewNotificationModal } from "../components/ViewNotificationModal";

const Notifications: React.FC = () => {
  const {
    isLoading,
    currentPage,
    filterType,
    searchTerm,
    allInspector,
    showForm,
    isEditModalOpen,
    isModalOpen,
    notificationToEdit,
    selectedNotification,
    formData,
    editFormData,
    filteredNotifications,
    totalPages,
    setSearchTerm,
    setFormData,
    setEditFormData,
    handleFilterChange,
    handleSearch,
    clearFilters,
    handlePreviousPage,
    handleNextPage,
    handleNuevaNotificacion,
    handleCloseForm,
    handleFormSubmit,
    handleEditClick,
    handleEditFormSubmit,
    handleViewDetails,
    handleCloseModal,
    handleInspectorToggle,
    handleTipoInfraccionToggle,
    handleEditTipoInfraccionToggle,
    deleteNotification,
  } = useNotifications();

  return (
    <LoaderContent
      isLoading={isLoading}
      loadingText="Cargando Notificaciones..."
      minHeight="400px"
    >
      <div className="bg-slate-700 max-w-full mx-auto p-6 space-y-6 rounded-lg">
        {/* Notificaciones próximas a vencer */}
        <UpcomingNotifications notifications={filteredNotifications.slice(0, 3)} />

        {/* Lista de notificaciones */}
        <div className="bg-gray-100 rounded-lg border border-gray-200 shadow-[8px_8px_10px_rgba(3,3,3,3.1)] shadow-gray-600">
          <div className="bg-gray-200 p-6 rounded-lg">
            <div className="flex items-center space-x-3 mb-4">
              <ClipboardList className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-black">
                Lista de Notificaciones
              </h1>
            </div>

            <NotificationsFilters
              filterType={filterType}
              searchTerm={searchTerm}
              onFilterChange={handleFilterChange}
              onSearchTermChange={setSearchTerm}
              onSearch={handleSearch}
              onClearFilters={clearFilters}
              onNewNotification={handleNuevaNotificacion}
            />

            <NotificationsTable
              notifications={filteredNotifications}
              onViewDetails={handleViewDetails}
              onEdit={handleEditClick}
              onDelete={deleteNotification}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePreviousPage}
              onNext={handleNextPage}
            />
          </div>
        </div>

        {/* Modales */}
        {showForm && (
          <CreateNotificationModal
            formData={formData}
            allInspector={allInspector}
            onClose={handleCloseForm}
            onSubmit={handleFormSubmit}
            onFormDataChange={setFormData}
            onInspectorToggle={handleInspectorToggle}
            onTipoInfraccionToggle={handleTipoInfraccionToggle}
          />
        )}

        {isEditModalOpen && notificationToEdit && (
          <EditNotificationModal
            editFormData={editFormData}
            onClose={() => handleCloseModal()}
            onSubmit={handleEditFormSubmit}
            onFormDataChange={setEditFormData}
            onTipoInfraccionToggle={handleEditTipoInfraccionToggle}
          />
        )}

        {isModalOpen && selectedNotification && (
          <ViewNotificationModal
            notification={selectedNotification}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </LoaderContent>
  );
};

export default Notifications;