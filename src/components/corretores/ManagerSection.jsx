import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";

export const ManagerSection = ({
    control,
    gerentes,
    canEditProfile,
    perfil,
}) => {
    if (perfil !== "CORRETOR" || !canEditProfile) return null;

    return (
        <div>
            <Label>Gerente Responsável</Label>
            <Controller
                name="gerenteId"
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um gerente (opcional)" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">Nenhum gerente</SelectItem>
                            {gerentes.map((g) => (
                                <SelectItem
                                    key={g.userId}
                                    value={String(g.userId)}
                                >
                                    {g.nome}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    );
};
