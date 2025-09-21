import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Upload, Save } from "lucide-react";

export default function ImobiliariaPage() {
    const [imobiliaria, setImobiliaria] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        nome: "",
        cnpj: "",
        endereco: {
            rua: "",
            numero: "",
            bairro: "",
            cidade: "",
            estado: "",
            cep: "",
        },
        telefone: "",
        email: "",
        logo_url: "",
        site: "",
        descricao: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const userData = await User.me();
            setCurrentUser(userData);

            // Apenas admins podem acessar
            if (userData.perfil !== "admin") {
                return;
            }

            const imobiliariaData = await Imobiliaria.list();
            if (imobiliariaData && imobiliariaData.length > 0) {
                const data = imobiliariaData[0];
                setImobiliaria(data);
                setFormData(data);
            }
        } catch (error) {
            console.error("Erro ao carregar dados da imobiliária:", error);
        }
        setIsLoading(false);
    };

    const handleInputChange = (field, value) => {
        if (field.includes(".")) {
            const [parent, child] = field.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleLogoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await UploadFile({ file });
            setFormData((prev) => ({
                ...prev,
                logo_url: result.file_url,
            }));
        } catch (error) {
            console.error("Erro ao fazer upload do logo:", error);
        }
        setIsUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (imobiliaria) {
                await Imobiliaria.update(imobiliaria.id, formData);
            } else {
                await Imobiliaria.create(formData);
            }
            loadData();
        } catch (error) {
            console.error("Erro ao salvar dados:", error);
        }
        setIsSaving(false);
    };

    // Verificar se é admin
    if (currentUser && currentUser.perfil !== "admin") {
        return (
            <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Acesso Negado
                        </h3>
                        <p className="text-gray-500">
                            Apenas administradores podem acessar esta página
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6 md:p-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-96 bg-gray-200 rounded-lg"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Dados da Imobiliária
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Configure as informações da sua imobiliária
                    </p>
                </div>

                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Informações Gerais
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Logo */}
                            <div className="space-y-4">
                                <Label>Logo da Imobiliária</Label>
                                <div className="flex items-center gap-4">
                                    {formData.logo_url && (
                                        <img
                                            src={formData.logo_url}
                                            alt="Logo"
                                            className="w-20 h-20 object-cover rounded-lg border"
                                        />
                                    )}
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoUpload}
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                document
                                                    .getElementById(
                                                        "logo-upload"
                                                    )
                                                    ?.click()
                                            }
                                            disabled={isUploading}
                                        >
                                            <Upload className="w-4 h-4 mr-2" />
                                            {isUploading
                                                ? "Enviando..."
                                                : "Escolher Arquivo"}
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Dados básicos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label>Nome da Imobiliária *</Label>
                                    <Input
                                        value={formData.nome}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "nome",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Nome da imobiliária"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>CNPJ *</Label>
                                    <Input
                                        value={formData.cnpj}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "cnpj",
                                                e.target.value
                                            )
                                        }
                                        placeholder="00.000.000/0001-00"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Telefone *</Label>
                                    <Input
                                        value={formData.telefone}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "telefone",
                                                e.target.value
                                            )
                                        }
                                        placeholder="(11) 3000-0000"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>E-mail *</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "email",
                                                e.target.value
                                            )
                                        }
                                        placeholder="contato@imobiliaria.com"
                                        required
                                    />
                                </div>
                                <div>
                                    <Label>Site</Label>
                                    <Input
                                        value={formData.site}
                                        onChange={(e) =>
                                            handleInputChange(
                                                "site",
                                                e.target.value
                                            )
                                        }
                                        placeholder="https://www.imobiliaria.com"
                                    />
                                </div>
                            </div>

                            {/* Endereço */}
                            <div className="space-y-4">
                                <Label className="text-lg font-semibold">
                                    Endereço
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="md:col-span-2">
                                        <Label>Rua</Label>
                                        <Input
                                            value={formData.endereco?.rua || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "endereco.rua",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nome da rua"
                                        />
                                    </div>
                                    <div>
                                        <Label>Número</Label>
                                        <Input
                                            value={
                                                formData.endereco?.numero || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "endereco.numero",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="123"
                                        />
                                    </div>
                                    <div>
                                        <Label>Bairro</Label>
                                        <Input
                                            value={
                                                formData.endereco?.bairro || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "endereco.bairro",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nome do bairro"
                                        />
                                    </div>
                                    <div>
                                        <Label>Cidade</Label>
                                        <Input
                                            value={
                                                formData.endereco?.cidade || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "endereco.cidade",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Nome da cidade"
                                        />
                                    </div>
                                    <div>
                                        <Label>Estado</Label>
                                        <Input
                                            value={
                                                formData.endereco?.estado || ""
                                            }
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "endereco.estado",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="SP"
                                        />
                                    </div>
                                    <div>
                                        <Label>CEP</Label>
                                        <Input
                                            value={formData.endereco?.cep || ""}
                                            onChange={(e) =>
                                                handleInputChange(
                                                    "endereco.cep",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="00000-000"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <Label>Descrição</Label>
                                <Textarea
                                    value={formData.descricao}
                                    onChange={(e) =>
                                        handleInputChange(
                                            "descricao",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Descreva a imobiliária..."
                                    rows={4}
                                />
                            </div>

                            <div className="flex justify-end pt-6">
                                <Button type="submit" disabled={isSaving}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isSaving ? "Salvando..." : "Salvar Dados"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
