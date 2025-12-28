import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * Componente de paginação reutilizável
 * Padroniza paginação entre todas as páginas do sistema
 */
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50],
  className = "",
}) {
  if (totalItems === 0) {
    return null;
  }

  const startItem = currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t bg-white ${className}`}
    >
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>
          Mostrando {startItem} a {endItem} de {totalItems}
        </span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">por página</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Anterior
        </Button>
        <span className="text-sm text-gray-600 min-w-[120px] text-center">
          Página {currentPage + 1} de {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage >= totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Próximo
        </Button>
      </div>
    </div>
  );
}
