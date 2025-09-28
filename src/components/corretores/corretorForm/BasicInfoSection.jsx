import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const BasicInfoSection = ({ register, errors, isEditingMode }) => {
    return (
        <>
            <div>
                <Label>Nome Completo *</Label>
                <Input
                    {...register("nome", { required: "Nome é obrigatório" })}
                    placeholder="Nome completo"
                    className="mt-2"
                />
                {errors.nome && (
                    <p className="text-red-500 text-xs">
                        {errors.nome.message}
                    </p>
                )}
            </div>

            <div>
                <Label>E-mail *</Label>
                <Input
                    type="email"
                    {...register("email", {
                        required: "E-mail é obrigatório",
                        pattern: {
                            value: /^\S+@\S+$/i,
                            message: "E-mail inválido",
                        },
                    })}
                    placeholder="email@exemplo.com"
                    className="mt-2"
                />
                {errors.email && (
                    <p className="text-red-500 text-xs">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {!isEditingMode && (
                <div>
                    <Label>Senha *</Label>
                    <Input
                        type="password"
                        {...register("senha", {
                            required: "Senha é obrigatória",
                            minLength: {
                                value: 8,
                                message:
                                    "Senha deve ter pelo menos 8 caracteres",
                            },
                        })}
                        placeholder="Senha"
                        className="mt-2"
                    />
                    {errors.senha && (
                        <p className="text-red-500 text-xs">
                            {errors.senha.message}
                        </p>
                    )}
                </div>
            )}

            <div>
                <Label>Telefone</Label>
                <Input
                    {...register("telefone")}
                    placeholder="(11) 99999-9999"
                    className="mt-2"
                />
            </div>

            <div>
                <Label>CRECI</Label>
                <Input
                    {...register("creci")}
                    placeholder="12345-J"
                    className="mt-2"
                />
            </div>
        </>
    );
};
