import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ClientesHeader from "@/components/clientes/clientePage/ClientesHeader";
import ClientesTable from "@/components/clientes/clienteTable/ClientesTable";
import DeleteConfirmationModal from "@/components/clientes/clientePage/DeleteConfirmationModal";
import { ClientesFilters } from "@/components/clientes/clientePage/ClientesFilters";
import { ClientesSkeleton } from "@/components/clientes/clientePage/ClientesSkeleton";
import { useAuth } from "@/contexts/AuthContext";
import useClientesData from "@/hooks/useClientesData";
import { useClientesFilters } from "@/hooks/useClientesFilters"; // Importar o novo hook
import { deleteCliente } from "@/services/ClienteService";
import { toast } from "sonner";

// Memoize child components for performance
const MemoizedClientesHeader = React.memo(ClientesHeader);
const MemoizedClientesFilters = React.memo(ClientesFilters);
const MemoizedClientesTable = React.memo(ClientesTable);
const MemoizedDeleteConfirmationModal = React.memo(DeleteConfirmationModal);
const MemoizedClientesSkeleton = React.memo(ClientesSkeleton);

export default function Clientes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const { allClientes, imoveis, isLoading, reload } = useClientesData(user);

  // Mover o estado do modal de exclusão para cá
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  // Map de imóveis por cliente (ainda necessário para o useClientesFilters)
  const clientImoveisMap = useMemo(() => {
    const map = {};
    imoveis.forEach((imovel) => {
      if (!map[imovel.clienteId]) {
        map[imovel.clienteId] = [];
      }
      map[imovel.clienteId].push(imovel);
    });
    return map;
  }, [imoveis]);

  // Consumir o novo hook de filtros
  const {
    searchTerm,
    setSearchTerm,
    perfilFilter,
    setPerfilFilter,
    sortField,
    sortOrder,
    filteredAndSortClientes,
    paginatedClientes,
    pagination,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  } = useClientesFilters(allClientes, clientImoveisMap); // Passar allClientes e clientImoveisMap

  useEffect(() => {
    if (user) {
      setCurrentUser({
        userId: user.sub,
        perfil: user.scope,
        email: user.email || "",
        nome: user.nome || "",
      });
    } else {
      setCurrentUser(null);
    }
  }, [user]);

  const canEdit = useCallback(
    (cliente) =>
      user?.scope === "ADMIN" ||
      user?.scope === "GERENTE" ||
      cliente.corretorId === user?.sub,
    [user]
  );

  const handleEdit = useCallback(
    (cliente) => {
      navigate(`/clientes/${cliente.id}/editar`);
    },
    [navigate]
  );

  const handleDelete = useCallback((id) => {
    setClientToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!clientToDelete) return; // Adicionado para evitar erro se clientToDelete for null

    try {
      await deleteCliente(clientToDelete);
      toast.success("Cliente excluído com sucesso!");
      // Após a exclusão, recarrega os dados. A página atual é resetada dentro de useClientesFilters via useEffect
      reload();
    } catch (error) {
      console.error("Erro ao excluir cliente:", error);
      const message =
        error.response?.data?.message ||
        "Erro ao excluir cliente. Tente novamente.";
      toast.error(message);
    } finally {
      setShowDeleteModal(false);
      setClientToDelete(null);
    }
  }, [clientToDelete, reload]);

  const handleNewCliente = useCallback(() => {
    navigate("/clientes/novo");
  }, [navigate]);

  if (isLoading) {
    return <MemoizedClientesSkeleton />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
      <div className="max-w-[1800px] 2xl:max-w-none mx-auto space-y-8">
        <MemoizedClientesHeader onNewCliente={handleNewCliente} />
        <MemoizedClientesFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          perfilFilter={perfilFilter}
          setPerfilFilter={setPerfilFilter}
          currentUser={currentUser}
        />
        <div className="mb-4">
          <p className="text-gray-600">
            {filteredAndSortClientes.length} clientes encontrados
          </p>
        </div>
        <MemoizedClientesTable
          paginatedClientes={paginatedClientes}
          pagination={pagination}
          handlePageChange={handlePageChange}
          handlePageSizeChange={handlePageSizeChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          canEdit={canEdit}
          clientImoveisMap={clientImoveisMap}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />
        <MemoizedDeleteConfirmationModal
          open={showDeleteModal}
          onOpenChange={setShowDeleteModal}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
          confirmLabel="Excluir"
          cancelLabel="Cancelar"
        />
      </div>
    </div>
  );
}
