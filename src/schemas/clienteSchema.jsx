import { z } from "zod";

// Helper para validar CPF/CNPJ
const cpfCnpjRegex =
  /^(\d{3}\.?\d{3}\.?\d{3}-?\d{2}|\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2})$/;

// Helper para validar CEP
const cepRegex = /^\d{5}-?\d{3}$/;

export const personalDataSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório."),
  email: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      "Email inválido."
    )
    .optional()
    .or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  telefoneAlternativo: z.string().optional().or(z.literal("")),
  emailAlternativo: z
    .string()
    .refine(
      (val) => !val || val === "" || z.string().email().safeParse(val).success,
      "Email alternativo inválido."
    )
    .optional()
    .or(z.literal("")),
  cpfCnpj: z
    .string()
    .refine(
      (val) => !val || val === "" || cpfCnpjRegex.test(val),
      "CPF/CNPJ inválido."
    )
    .optional()
    .or(z.literal("")),
  dataNascimento: z.string().optional(),
  estadoCivil: z.string().optional(),
  profissao: z.string().optional(),
  perfil: z.enum([
    "CLIENTE",
    "PROPRIETARIO",
    "LOCATARIO",
    "FIADOR",
    "CORRETOR_PARCEIRO",
  ]),
  corretorId: z.string().optional(),
});

export const addressSchema = z.object({
  endereco: z.object({
    bairro: z.string().min(1, "Bairro é obrigatório."),
    cep: z.string().min(1, "CEP é obrigatório."),
    cidade: z.string().min(1, "Cidade é obrigatória."),
    estado: z.string().min(1, "Estado é obrigatório."),
    complemento: z.string().optional(),
    andar: z.preprocess((val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().optional()),
    latitude: z.preprocess(
      (val) => {
        if (val === "" || val === null || val === undefined) return undefined;
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
        if (val === "" || val === null || val === undefined) return undefined;
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

export const documentsSchema = z.object({
  documentos: z.array(z.any()).optional(),
});

export const financialSchema = z.object({
  rendaMensal: z.union([z.string(), z.number()]).optional(),
  profissao: z.string().optional(),
  banco: z.string().optional(),
  agencia: z.string().optional(),
  conta: z.string().optional(),
  scoreCredito: z.union([z.string(), z.number()]).optional(),
  restricoesFinanceiras: z.boolean().optional(),
  observacoesFinanceiras: z.string().optional(),
});

export const preferencesSchema = z.object({
  interesses: z
    .object({
      tiposImovel: z.array(z.string()).optional(),
      faixaPrecoMin: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().optional()),
      faixaPrecoMax: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().optional()),
      bairrosInteresse: z.array(z.string()).optional(),
      finalidade: z.string().optional(),
      quartos: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().optional()),
      banheiros: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().optional()),
      vagas: z.preprocess((val) => {
        if (val === "" || val === null || val === undefined) return undefined;
        const num = Number(val);
        return isNaN(num) ? undefined : num;
      }, z.number().optional()),
      observacoesPreferencias: z.string().optional(),
    })
    .optional(),
});

export const observationsSchema = z.object({
  observacoes: z.string().optional(),
  observacoesInternas: z.string().optional(),
});

// Schema completo combinando todas as seções
export const clienteSchema = personalDataSchema
  .merge(addressSchema)
  .merge(documentsSchema)
  .merge(financialSchema)
  .merge(preferencesSchema)
  .merge(observationsSchema);
