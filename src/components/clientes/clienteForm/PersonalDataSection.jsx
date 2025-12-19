import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, Calendar, Briefcase, Heart } from "lucide-react";
import { fetchUsers } from "@/services/UserService";
import { useEffect, useState } from "react";

const ESTADOS_CIVIS = [
  { value: "solteiro", label: "Solteiro(a)" },
  { value: "casado", label: "Casado(a)" },
  { value: "divorciado", label: "Divorciado(a)" },
  { value: "viuvo", label: "Viúvo(a)" },
  { value: "uniao_estavel", label: "União Estável" },
];

const PERFIS = [
  { value: "CLIENTE", label: "Cliente" },
  { value: "PROPRIETARIO", label: "Proprietário" },
  { value: "LOCATARIO", label: "Locatário" },
  { value: "FIADOR", label: "Fiador" },
  { value: "CORRETOR_PARCEIRO", label: "Corretor Parceiro" },
];

export default function PersonalDataSection({
  formData,
  onInputChange,
  currentUser,
  errors,
}) {
  const [corretores, setCorretores] = useState([]);
  console.log(errors);
  useEffect(() => {
    const loadCorretores = async () => {
      try {
        const users = await fetchUsers();
        setCorretores(users || []);
      } catch (error) {
        console.error("Erro ao carregar corretores:", error);
      }
    };
    loadCorretores();
  }, []);

  const formatTelefone = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").trim();
    }
    return cleaned.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").trim();
  };

  const formatCPFCNPJ = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 11) {
      // CPF
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    // CNPJ
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  };

  const handleTelefoneChange = (field, value) => {
    const formatted = formatTelefone(value);
    onInputChange(field, formatted);
  };

  const handleCPFCNPJChange = (value) => {
    const formatted = formatCPFCNPJ(value);
    onInputChange("cpfCnpj", formatted);
  };

  const showDataNascimento = formData.perfil !== "CORRETOR_PARCEIRO";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5 text-blue-600" />
        <Label className="text-lg font-semibold">Informações Básicas</Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nome */}
        <div>
          <Label htmlFor="nome">
            Nome Completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nome"
            value={formData.nome}
            onChange={(e) => onInputChange("nome", e.target.value)}
            className="mt-2"
            placeholder="Nome completo"
          />
          {errors?.nome && (
            <p className="text-sm text-red-500 mt-1">{errors.nome}</p>
          )}
        </div>

        {/* Perfil */}
        <div>
          <Label htmlFor="perfil">
            Perfil <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.perfil || "CLIENTE"}
            onValueChange={(value) => onInputChange("perfil", value)}
            required
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              {PERFIS.map((perfil) => (
                <SelectItem key={perfil.value} value={perfil.value}>
                  {perfil.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.perfil && (
            <p className="text-sm text-red-500 mt-1">{errors.perfil}</p>
          )}
        </div>

        {/* CPF/CNPJ */}
        <div>
          <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
          <Input
            id="cpfCnpj"
            value={formData.cpfCnpj || ""}
            onChange={(e) => handleCPFCNPJChange(e.target.value)}
            className="mt-2"
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            maxLength={18}
          />
          {errors?.cpfCnpj && (
            <p className="text-sm text-red-500 mt-1">{errors.cpfCnpj}</p>
          )}
        </div>

        {/* Data de Nascimento */}
        {showDataNascimento && (
          <div>
            <Label htmlFor="dataNascimento">
              <Calendar className="w-4 h-4 inline mr-1" />
              Data de Nascimento
            </Label>
            <Input
              id="dataNascimento"
              type="date"
              value={formData.dataNascimento || ""}
              onChange={(e) => onInputChange("dataNascimento", e.target.value)}
              className="mt-2"
            />
            {errors?.dataNascimento && (
              <p className="text-sm text-red-500 mt-1">
                {errors.dataNascimento}
              </p>
            )}
          </div>
        )}

        {/* Estado Civil */}
        {showDataNascimento && (
          <div>
            <Label htmlFor="estadoCivil">
              <Heart className="w-4 h-4 inline mr-1" />
              Estado Civil
            </Label>
            <Select
              value={formData.estadoCivil || ""}
              onValueChange={(value) => onInputChange("estadoCivil", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o estado civil" />
              </SelectTrigger>
              <SelectContent>
                {ESTADOS_CIVIS.map((estado) => (
                  <SelectItem key={estado.value} value={estado.value}>
                    {estado.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Profissão */}
        <div>
          <Label htmlFor="profissao">
            <Briefcase className="w-4 h-4 inline mr-1" />
            Profissão
          </Label>
          <Input
            id="profissao"
            value={formData.profissao || ""}
            onChange={(e) => onInputChange("profissao", e.target.value)}
            className="mt-2"
            placeholder="Ex: Engenheiro, Médico, etc."
          />
        </div>
      </div>

      {/* Contatos */}
      <div className="border-t pt-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-5 h-5 text-green-600" />
          <Label className="text-lg font-semibold">Contatos</Label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email Principal */}
          <div>
            <Label htmlFor="email">
              <Mail className="w-4 h-4 inline mr-1" />
              E-mail Principal
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email || ""}
              onChange={(e) => onInputChange("email", e.target.value)}
              className="mt-2"
              placeholder="email@exemplo.com"
            />
            {errors?.email && (
              <p className="text-sm text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Email Alternativo */}
          <div>
            <Label htmlFor="emailAlternativo">
              <Mail className="w-4 h-4 inline mr-1" />
              E-mail Alternativo
            </Label>
            <Input
              id="emailAlternativo"
              type="email"
              value={formData.emailAlternativo || ""}
              onChange={(e) =>
                onInputChange("emailAlternativo", e.target.value)
              }
              className="mt-2"
              placeholder="email2@exemplo.com"
            />
            {errors?.emailAlternativo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.emailAlternativo}
              </p>
            )}
          </div>

          {/* Telefone Principal */}
          <div>
            <Label htmlFor="telefone">
              <Phone className="w-4 h-4 inline mr-1" />
              Telefone Principal
            </Label>
            <Input
              id="telefone"
              value={formData.telefone || ""}
              onChange={(e) => handleTelefoneChange("telefone", e.target.value)}
              className="mt-2"
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
            {errors?.telefone && (
              <p className="text-sm text-red-500 mt-1">{errors.telefone}</p>
            )}
          </div>

          {/* Telefone Alternativo */}
          <div>
            <Label htmlFor="telefoneAlternativo">
              <Phone className="w-4 h-4 inline mr-1" />
              Telefone Alternativo
            </Label>
            <Input
              id="telefoneAlternativo"
              value={formData.telefoneAlternativo || ""}
              onChange={(e) =>
                handleTelefoneChange("telefoneAlternativo", e.target.value)
              }
              className="mt-2"
              placeholder="(11) 99999-9999"
              maxLength={15}
            />
            {errors?.telefoneAlternativo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.telefoneAlternativo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Corretor Responsável */}
      <div className="border-t pt-6 mt-6">
        <Label className="text-lg font-semibold mb-4 block">
          Corretor Responsável
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="corretorId">Corretor</Label>
            <Select
              value={formData.corretorId || String(currentUser?.sub || "")}
              onValueChange={(value) => onInputChange("corretorId", value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Selecione o corretor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nenhum</SelectItem>
                {corretores.map((corretor) => (
                  <SelectItem
                    key={corretor.userId}
                    value={String(corretor.userId)}
                  >
                    {corretor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors?.corretorId && (
              <p className="text-sm text-red-500 mt-1">{errors.corretorId}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
