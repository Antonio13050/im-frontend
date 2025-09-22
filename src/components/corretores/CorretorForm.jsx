import React, { useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGerentes } from "@/hooks/useGerentes";
import { BasicInfoSection } from "./BasicInfoSection";
import { ProfileSection } from "./ProfileSection";
import { ManagerSection } from "./ManagerSection";
import { toast } from "sonner";

const formSchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido").min(1, "E-mail é obrigatório"),
    senha: z.string().optional(),
    telefone: z.string().optional(),
    creci: z.string().optional(),
    perfil: z.enum(["CORRETOR", "GERENTE", "ADMIN"]),
    ativo: z.boolean(),
    gerenteId: z.string().optional(),
});

export default function CorretorForm({
    corretor,
    onSave,
    onCancel,
    currentUser,
    allUsers,
}) {
    const isEditingMode = !!corretor;
    const gerentes = useGerentes(allUsers);
    const canEditProfile = currentUser?.perfil === "ADMIN";

    const defaultValues = useMemo(
        () => ({
            nome: corretor?.nome || "",
            email: corretor?.email || "",
            senha: "",
            telefone: corretor?.telefone || "",
            creci: corretor?.creci || "",
            perfil: corretor?.roles?.[0]?.nome?.toUpperCase() || "CORRETOR",
            ativo: corretor?.ativo !== false,
            gerenteId: corretor?.gerenteId
                ? String(corretor.gerenteId)
                : "none",
        }),
        [corretor]
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        control,
        watch,
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const perfil = watch("perfil");

    const onSubmit = async (data) => {
        try {
            const dataToSave = {
                ...data,
                role: data.perfil,
                ativo: data.ativo,
                gerenteId:
                    data.perfil === "CORRETOR"
                        ? data.gerenteId
                            ? Number(data.gerenteId)
                            : null
                        : null,
            };
            if (!isEditingMode) {
                if (!data.senha || data.senha.length < 8) {
                    throw new Error("Senha deve ter pelo menos 8 caracteres");
                }
            } else {
                delete dataToSave.senha; // Não enviar senha em edição
            }
            console.log("Payload enviado:", dataToSave);
            await onSave(dataToSave);
        } catch (error) {
            console.error("Erro ao salvar usuário:", error);
            toast.error(`Erro ao salvar: ${error.message}`);
        }
    };

    const modalTitle = useMemo(() => {
        if (isEditingMode) {
            return perfil === "GERENTE" ? "Editar Gerente" : "Editar Corretor";
        }
        return perfil === "GERENTE" ? "Novo Gerente" : "Novo Corretor";
    }, [isEditingMode, perfil]);

    return (
        <Dialog open onOpenChange={onCancel}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{modalTitle}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <BasicInfoSection
                        register={register}
                        errors={errors}
                        isEditingMode={isEditingMode}
                    />
                    <ProfileSection
                        control={control}
                        canEditProfile={canEditProfile}
                        currentUser={currentUser}
                    />
                    <ManagerSection
                        control={control}
                        gerentes={gerentes}
                        canEditProfile={canEditProfile}
                        perfil={perfil}
                    />

                    {perfil === "GERENTE" && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-700">
                                <strong>Gerentes</strong> podem visualizar e
                                gerenciar os corretores de sua equipe, bem como
                                todos os imóveis e clientes vinculados a esses
                                corretores.
                            </p>
                        </div>
                    )}

                    <div className="flex items-center space-x-2">
                        <Controller
                            name="ativo"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    id="ativo"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor="ativo">Usuário ativo</Label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Salvando..." : "Salvar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
