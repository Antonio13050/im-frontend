import { z } from "zod";

export const basicInfoSchema = z.object({
    titulo: z.string().min(1, "Título é obrigatório."),
    tipo: z.string().min(1, "Tipo é obrigatório."),
    subtipo: z.string().optional(),
    finalidade: z.string().min(1, "Finalidade é obrigatória."),
    status: z.string().optional(),
    destaque: z.boolean().optional(),
    exclusividade: z.boolean().optional(),
    corretorId: z.string().optional(),
    proprietarioId: z.string().optional(),
    inquilinoId: z.string().optional(),
    clienteId: z.string().optional(),
    descricao: z.string().optional(),
});

export const addressSchema = z.object({
    endereco: z.object({
        bairro: z.string().min(1, "Bairro é obrigatório."),
        cep: z.string().min(1, "CEP é obrigatório."),
        cidade: z.string().min(1, "Cidade é obrigatória."),
        estado: z.string().min(1, "Estado é obrigatório."),
        complemento: z.string().optional(),
        andar: z.union([z.string(), z.number()]).optional(),
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
    // Áreas
    areaTotal: z.union([z.string(), z.number()]).optional(),
    areaConstruida: z.union([z.string(), z.number()]).optional(),
    areaUtil: z.union([z.string(), z.number()]).optional(),
    anoConstrucao: z.union([z.string(), z.number()]).optional(),

    // Cômodos
    quartos: z.union([z.string(), z.number()]).optional(),
    suites: z.union([z.string(), z.number()]).optional(),
    banheiros: z.union([z.string(), z.number()]).optional(),
    vagas: z.union([z.string(), z.number()]).optional(),
    vagasCobertas: z.union([z.string(), z.number()]).optional(),
    andares: z.union([z.string(), z.number()]).optional(),

    // Comodidades
    comodidades: z.array(z.string()).optional(),
});

export const financeSchema = z.object({
    // Preços - validação condicional será feita no frontend
    precoVenda: z.union([z.string(), z.number()]).optional(),
    precoAluguel: z.union([z.string(), z.number()]).optional(),
    precoTemporada: z.union([z.string(), z.number()]).optional(),
    valorCondominio: z.union([z.string(), z.number()]).optional(),
    valorIptu: z.union([z.string(), z.number()]).optional(),
    valorEntrada: z.union([z.string(), z.number()]).optional(),

    // Opções
    aceitaFinanciamento: z.boolean().optional(),
    aceitaFgts: z.boolean().optional(),
    aceitaPermuta: z.boolean().optional(),
    posseImediata: z.boolean().optional(),

    // Comissões
    comissaoVenda: z.union([z.string(), z.number()]).optional(),
    comissaoAluguel: z.union([z.string(), z.number()]).optional(),
});

export const documentsSchema = z.object({
    situacaoDocumental: z.string().optional(),
    observacoesInternas: z.string().optional(),
    documentos: z.array(z.any()).optional(),
});

export const mediaSchema = z.object({
    fotos: z.array(z.any()).optional(),
    videos: z.array(z.any()).optional(),
});

// Schema com validação condicional para preço baseado na finalidade
export const imovelSchema = basicInfoSchema
    .merge(addressSchema)
    .merge(featuresSchema)
    .merge(financeSchema)
    .merge(documentsSchema)
    .merge(mediaSchema)
    .refine(
        (data) => {
            // Validação condicional de preço
            if (data.finalidade === "venda" || data.finalidade === "venda_aluguel") {
                return data.precoVenda && Number(data.precoVenda) > 0;
            }
            if (data.finalidade === "aluguel" || data.finalidade === "venda_aluguel") {
                return data.precoAluguel && Number(data.precoAluguel) > 0;
            }
            if (data.finalidade === "temporada") {
                return data.precoTemporada && Number(data.precoTemporada) > 0;
            }
            return true;
        },
        {
            message: "Informe o preço de acordo com a finalidade do imóvel.",
            path: ["precoVenda"],
        }
    );
