import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CorretorForm from "@/components/corretores/corretorForm/CorretorForm";
import AccessDenied from "@/components/common/AccessDenied";
import { createUser, updateUser } from "@/services/UserService";
import { useAuth } from "@/contexts/AuthContext";
import { useFetchUsers } from "@/hooks/useFetchUsers";
import { useCorretoresFilters } from "@/hooks/useCorretoresFilters"; // Importar o novo hook
import { UserFilters } from "@/components/corretores/corretorPage/UserFilters";
import { CorretoresSkeleton } from "@/components/corretores/corretorPage/CorretoresSkeleton";
import CorretorTable from "@/components/corretores/corretorTable/CorretorTable";
import Pagination from "@/components/common/Pagination"; // Importar o componente de paginação
import { toast } from "sonner";

// Memoize child components for performance
const MemoizedButton = React.memo(Button);
const MemoizedUserFilters = React.memo(UserFilters);
const MemoizedCorretorTable = React.memo(CorretorTable);
const MemoizedCorretorForm = React.memo(CorretorForm);
const MemoizedCorretoresSkeleton = React.memo(CorretoresSkeleton);
const MemoizedAccessDenied = React.memo(AccessDenied);

export default function Corretores() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const { allUsers, isLoading, error, reload } = useFetchUsers(user);
  const [showForm, setShowForm] = useState(false);
  const [editingCorretor, setEditingCorretor] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [corretorToToggle, setCorretorToToggle] = useState(null);

  // Consumir o novo hook de filtros
  const {
    searchTerm,
    setSearchTerm,
    perfilFilter,
    setPerfilFilter,
    sortField,
    sortOrder,
    filteredAndSortCorretores,
    paginatedCorretores,
    pagination,
    handleSort,
    handlePageChange,
    handlePageSizeChange,
  } = useCorretoresFilters(allUsers); // Passar allUsers

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

  const handleSave = useCallback(
    async (data) => {
      try {
        if (editingCorretor) {
          await updateUser(editingCorretor.userId, {
            nome: data.nome,
            email: data.email,
            telefone: data.telefone,
            creci: data.creci,
            ativo: data.ativo,
            gerenteId: data.gerenteId,
            role: data.role,
          });
          toast.success("Corretor atualizado com sucesso!");
        } else {
          await createUser({
            ...data,
            gerenteId:
              currentUser.perfil === "GERENTE"
                ? currentUser.userId
                : data.gerenteId,
            role: data.perfil,
          });
          toast.success("Corretor criado com sucesso!");
        }
        setShowForm(false);
        setEditingCorretor(null);
        reload();
      } catch (error) {
        console.error("Erro ao salvar:", error);
        toast.error(`Erro ao salvar: ${error.message}`);
      }
    },
    [editingCorretor, currentUser, reload]
  );

  const handleEdit = useCallback((corretor) => {
    setEditingCorretor(corretor);
    setShowForm(true);
  }, []);

  const handleToggleStatus = useCallback((corretor) => {
    setCorretorToToggle(corretor);
    setShowStatusModal(true);
  }, []);

  const confirmToggleStatus = useCallback(async () => {
    if (!corretorToToggle) return;
    try {
      await updateUser(corretorToToggle.userId, {
        nome: corretorToToggle.nome,
        email: corretorToToggle.email,
        telefone: corretorToToggle.telefone,
        creci: corretorToToggle.creci,
        ativo: !corretorToToggle.ativo,
        gerenteId: corretorToToggle.gerenteId,
        role: corretorToToggle.roles?.[0]?.nome || "CORRETOR",
      });
      toast.success(
        `Status alterado para ${
          !corretorToToggle.ativo ? "Ativo" : "Inativo"
        } com sucesso!`
      );
      reload();
    } catch (error) {
      console.error("Erro ao alterar status:", error);
      toast.error(`Erro ao alterar status: ${error.message}`);
    } finally {
      setShowStatusModal(false);
      setCorretorToToggle(null);
    }
  }, [corretorToToggle, reload]);

  const getPageTitle = useCallback(
    () =>
      currentUser?.perfil === "ADMIN" ? "Gerentes e Corretores" : "Sua Equipe",
    [currentUser]
  );
  const getPageDescription = useCallback(
    () =>
      currentUser?.perfil === "ADMIN"
        ? "Gerencie gerentes e corretores da imobiliária"
        : "Gerencie os corretores da sua equipe",
    [currentUser]
  );

  const handleCancelForm = useCallback(() => {
    setShowForm(false);
    setEditingCorretor(null);
  }, []);

  const handleOpenNewCorretorForm = useCallback(() => {
    setEditingCorretor(null);
    setShowForm(true);
  }, []);

  if (isLoading) {
    return <MemoizedCorretoresSkeleton />;
  }

  // if (error && error.message === "Access Denied") { // Supondo que AccessDenied é um componente separado
  //     return <MemoizedAccessDenied />;
  // }

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-12 bg-gray-50 min-h-screen py-6">
      <div className="max-w-[1800px] 2xl:max-w-none mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {getPageTitle()}
            </h1>
            <p className="text-gray-600 mt-1">{getPageDescription()}</p>
          </div>
          <MemoizedButton
            onClick={handleOpenNewCorretorForm}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {currentUser?.perfil === "ADMIN" ? "Novo Usuário" : "Novo Corretor"}
          </MemoizedButton>
        </div>

        <MemoizedUserFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          perfilFilter={perfilFilter}
          setPerfilFilter={setPerfilFilter}
          currentUser={currentUser}
        />

        <div className="mb-4">
          <p className="text-gray-600">
            {filteredAndSortCorretores.length} corretores encontrados
          </p>
        </div>

        <MemoizedCorretorTable
          paginatedCorretores={paginatedCorretores}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          isLoading={isLoading}
          sortField={sortField}
          sortOrder={sortOrder}
          handleSort={handleSort}
        />

        {/* Adiciona o componente de paginação comum */}
        {pagination.totalItems > 0 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pagination.pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            pageSizeOptions={[10, 15, 20, 30]} // Valores de exemplo, ajustar conforme necessário
          />
        )}

        {showForm && (
          <MemoizedCorretorForm
            corretor={editingCorretor}
            onSave={handleSave}
            onCancel={handleCancelForm}
            currentUser={currentUser}
            allUsers={allUsers}
          />
        )}
      </div>
    </div>
  );
}
