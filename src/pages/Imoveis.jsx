import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ImoveisHeader from "@/components/imoveis/imovelPage/ImoveisHeader";
import ImoveisSearchAndFilters from "@/components/imoveis/imovelPage/ImoveisSearchAndFilters";
import ImoveisCardsList from "@/components/imoveis/imovelPage/ImoveisCardsList";
import ImoveisTable from "@/components/imoveis/imovelTable/ImoveisTable";
import ImoveisList from "@/components/imoveis/imovelPage/ImoveisList";
import ImovelMapa from "@/components/imoveis/imovelMapa/ImovelMapa";
import Pagination from "@/components/common/Pagination";
import DeleteConfirmationModal from "@/components/clientes/clientePage/DeleteConfirmationModal";
import { ImoveisSkeleton } from "@/components/imoveis/imovelPage/ImoveisSkeleton";

import { useAuth } from "@/contexts/AuthContext";
import useImoveisData from "@/hooks/useImoveisData";
import { useImoveisFilters } from "@/hooks/useImoveisFilters";
import { deleteImovel } from "@/services/ImovelService";

export default function Imoveis() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allImoveis, clientes, corretores, isLoading, reload } =
    useImoveisData(user);

  // Hook customizado para filtros, busca e paginação
  const {
    searchTerm,
    filters,
    filteredImoveis,
    paginatedImoveis,
    pagination,
    setSearchTerm,
    updateFilters,
    handlePageChange,
    handlePageSizeChange,
    isSearchPending,
  } = useImoveisFilters(allImoveis);

  // Estado para modo de visualização
  const [viewMode, setViewMode] = useState("cards");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imovelToDelete, setImovelToDelete] = useState(null);

  // Persiste o modo de visualização no localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("viewMode") || "cards";
    setViewMode(savedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // Mapeamento rápido de clientes e corretores (memoizado)
  const clientesMap = useMemo(
    () => new Map(clientes.map((c) => [c.id, c.nome])),
    [clientes]
  );
  const corretoresMap = useMemo(
    () => new Map(corretores.map((c) => [c.userId, c.nome])),
    [corretores]
  );

  // Controle de edição/exclusão
  const canEdit = useCallback(
    (imovel) =>
      user?.scope === "ADMIN" ||
      user?.scope === "GERENTE" ||
      imovel.corretorId === user?.sub,
    [user]
  );

  const handleEdit = useCallback(
    (imovelId) => navigate(`/imoveis/${imovelId}/editar`),
    [navigate]
  );

  const handleDelete = useCallback((id) => {
    setImovelToDelete(id);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!imovelToDelete) return;

    try {
      await deleteImovel(imovelToDelete);
      toast.success("Imóvel excluído com sucesso!");
      reload();
    } catch (error) {
      toast.error(
        `Erro ao excluir imóvel: ${error.message || "Erro desconhecido"}`
      );
    } finally {
      setShowDeleteModal(false);
      setImovelToDelete(null);
    }
  }, [imovelToDelete, reload]);

  const toggleViewMode = useCallback((mode) => setViewMode(mode), []);

  // Loading state
  if (isLoading) {
    return <ImoveisSkeleton />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
      <div className="max-w-[1800px] 2xl:max-w-none mx-auto space-y-8">
        <ImoveisHeader viewMode={viewMode} onToggleViewMode={toggleViewMode} />

        <ImoveisSearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filters={filters}
          onFiltersChange={updateFilters}
        />

        <p className="text-gray-600 text-sm mb-4">
          {filteredImoveis.length} imóveis encontrados
          {isSearchPending && (
            <span className="ml-2 text-gray-400 text-xs">(buscando...)</span>
          )}
        </p>

        {viewMode === "cards" && (
          <ImoveisCardsList
            filteredImoveis={paginatedImoveis}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEdit}
            clientesMap={clientesMap}
            corretoresMap={corretoresMap}
          />
        )}

        {viewMode === "table" && (
          <ImoveisTable
            imoveis={paginatedImoveis}
            clientesMap={clientesMap}
            corretoresMap={corretoresMap}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEdit}
          />
        )}

        {viewMode === "list" && (
          <ImoveisList
            filteredImoveis={paginatedImoveis}
            onEdit={handleEdit}
            onDelete={handleDelete}
            canEdit={canEdit}
            clientesMap={clientesMap}
            corretoresMap={corretoresMap}
          />
        )}

        {viewMode === "map" && (
          <ImovelMapa imoveis={filteredImoveis} isLoading={false} />
        )}

        {/* Paginação (não exibe no modo mapa) */}
        {viewMode !== "map" && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 15, 20, 30]}
          />
        )}
      </div>

      {/* Modal de confirmação de exclusão */}
      <DeleteConfirmationModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita."
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
      />
    </div>
  );
}
