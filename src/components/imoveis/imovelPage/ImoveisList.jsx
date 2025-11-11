import React from "react";
import ImovelCard from "../imovelCard/ImovelCard";
import { Search } from "lucide-react";

export default function ImoveisList({
    filteredImoveis,
    onEdit,
    onDelete,
    canEdit,
    clientesMap,
    corretoresMap,
}) {
    if (filteredImoveis.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum imóvel encontrado
                </h3>
                <p className="text-gray-500">
                    Tente ajustar os filtros de busca ou adicione um novo imóvel
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5 items-stretch">
            {filteredImoveis.map((imovel) => (
                <ImovelCard
                    key={imovel.id}
                    imovel={imovel}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    canEdit={canEdit(imovel)}
                    clienteNome={
                        imovel.clienteId
                            ? clientesMap.get(imovel.clienteId)
                            : null
                    }
                    corretorNome={
                        imovel.corretorId
                            ? corretoresMap.get(imovel.corretorId)
                            : null
                    }
                />
            ))}
        </div>
    );
}
