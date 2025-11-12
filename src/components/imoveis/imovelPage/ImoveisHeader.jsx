import { Plus, LayoutGrid, List, Table2, Map } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ImoveisHeader({ viewMode, onToggleViewMode }) {
    const navigate = useNavigate();

    const handleNewImovel = () => {
        navigate("/imoveis/novo");
    };

    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            {/* Botão Novo Imóvel */}
            <Button
                onClick={handleNewImovel}
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Novo Imóvel
            </Button>

            {/* Alternador de Visualização */}
            <div className="flex flex-wrap gap-2">
                <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    onClick={() => onToggleViewMode("list")}
                    className="flex items-center gap-2"
                >
                    <List className="w-4 h-4" />
                    Lista
                </Button>

                <Button
                    variant={viewMode === "cards" ? "default" : "outline"}
                    onClick={() => onToggleViewMode("cards")}
                    className="flex items-center gap-2"
                >
                    <LayoutGrid className="w-4 h-4" />
                    Cards
                </Button>

                <Button
                    variant={viewMode === "table" ? "default" : "outline"}
                    onClick={() => onToggleViewMode("table")}
                    className="flex items-center gap-2"
                >
                    <Table2 className="w-4 h-4" />
                    Tabela
                </Button>

                <Button
                    variant={viewMode === "map" ? "default" : "outline"}
                    onClick={() => onToggleViewMode("map")}
                    className="flex items-center gap-2"
                >
                    <Map className="w-4 h-4" />
                    Mapa
                </Button>
            </div>
        </div>
    );
}
