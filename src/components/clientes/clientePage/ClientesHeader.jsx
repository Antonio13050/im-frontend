import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ClientesHeader({ onNewCliente }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <Button
        onClick={onNewCliente}
        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Novo Cliente
      </Button>
    </div>
  );
}
