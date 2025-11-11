import { z } from "zod";

export const basicInfoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório."),
    tipo: z.string().min(1, "Tipo é obrigatório."),
    finalidade: z.string().min(1, "Finalidade é obrigatória."),
    status: z.string().optional(),
    corretorId: z.string().optional(),
    clienteId: z.string().optional(),
});

export const addressSchema = z.object({
    endereco: z.object({
        bairro: z.string().min(1, "Bairro é obrigatório."),
        cep: z.string().min(1, "CEP é obrigatório."),
        cidade: z.string().min(1, "Cidade é obrigatória."),
        estado: z.string().min(1, "Estado é obrigatório."),
        latitude: z.preprocess(
            (val) => {
                if (val === "" || val === null || val === undefined)
                    return undefined;
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            },
            z
                .number({ invalid_type_error: "Latitude é obrigatória." })
                .refine((val) => val >= -90 && val <= 90, {
                    message: "Latitude deve estar entre -90 e 90.",
                })
        ),

        longitude: z.preprocess(
            (val) => {
                if (val === "" || val === null || val === undefined)
                    return undefined;
                const num = Number(val);
                return isNaN(num) ? undefined : num;
            },
            z
                .number({ invalid_type_error: "Longitude é obrigatória." })
                .refine((val) => val >= -180 && val <= 180, {
                    message: "Longitude deve estar entre -180 e 180.",
                })
        ),
        numero: z.string().min(1, "Número é obrigatório."),
        rua: z.string().min(1, "Rua é obrigatória."),
    }),
});

export const featuresSchema = z.object({
    preco: z
        .union([z.string(), z.number()])
        .refine((val) => Number(val) > 0, "Preço é obrigatório."),
});

export const imovelSchema = basicInfoSchema
    .merge(addressSchema)
    .merge(featuresSchema);
