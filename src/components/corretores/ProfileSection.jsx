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

export const ProfileSection = ({ control, canEditProfile, currentUser }) => {
    return (
        <div>
            <Label>Perfil *</Label>
            <Controller
                name="perfil"
                control={control}
                render={({ field }) => (
                    <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!canEditProfile}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione um perfil" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CORRETOR">Corretor</SelectItem>
                            <SelectItem value="GERENTE">Gerente</SelectItem>
                            {currentUser?.perfil === "ADMIN" && (
                                <SelectItem value="ADMIN">
                                    Administrador
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                )}
            />
            {!canEditProfile && (
                <p className="text-xs text-gray-500 mt-1">
                    Apenas admins podem alterar o perfil.
                </p>
            )}
        </div>
    );
};
