import React from "react";
import { useParams } from "react-router-dom";
import { useLeadsData } from "../hooks/useLeadsData";
import useImoveisData from "../hooks/useImoveisData";

export default function ClienteImoveisPersonalizados() {
    const { id } = useParams();
    const { leads } = useLeadsData();
    const { imoveis, loading } = useImoveisData();

    const lead = leads.find((l) => String(l.id) === String(id));
    if (!lead) return <div>Lead não encontrado.</div>;

    // Exemplo: filtra imóveis pelas preferências do lead
    const imoveisFiltrados = imoveis.filter((imovel) =>
        lead.preferencias?.some(
            (pref) =>
                (imovel.tipo && imovel.tipo.includes(pref)) ||
                (imovel.titulo && imovel.titulo.includes(pref))
        )
    );

    return (
        <div style={{ padding: 24 }}>
            <h2>Página personalizada para {lead.nome}</h2>
            <div style={{ marginBottom: 16 }}>
                <b>Preferências:</b> {lead.preferencias?.join(", ") || "-"}
            </div>
            <h3>Imóveis recomendados</h3>
            {loading && <div>Carregando imóveis...</div>}
            {!loading && imoveisFiltrados.length === 0 && (
                <div>Nenhum imóvel encontrado para as preferências.</div>
            )}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {imoveisFiltrados.map((imovel) => (
                    <div
                        key={imovel.id}
                        style={{
                            background: "#fff",
                            borderRadius: 8,
                            padding: 16,
                            minWidth: 220,
                            boxShadow: "0 1px 4px #0002",
                        }}
                    >
                        <div>
                            <b>{imovel.titulo}</b>
                        </div>
                        <div>Tipo: {imovel.tipo}</div>
                        <div>
                            Preço: {imovel.preco ? `R$ ${imovel.preco}` : "-"}
                        </div>
                        {/* Adicione mais campos conforme necessário */}
                    </div>
                ))}
            </div>
        </div>
    );
}
