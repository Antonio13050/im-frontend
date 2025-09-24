import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { toast } from "sonner";

export default function PhotosSection({ formData, setFormData }) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef();

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (formData.fotos.length + files.length > 10) {
            toast.error("Máximo de 10 fotos permitidas");
            return;
        }

        setIsUploading(true);
        try {
            const newFotos = files.map((file) => ({
                id: null,
                nomeArquivo: file.name,
                dados: URL.createObjectURL(file),
                file: file,
            }));
            setFormData((prev) => ({
                ...prev,
                fotos: [...prev.fotos, ...newFotos],
            }));
            toast.success("Fotos selecionadas com sucesso!");
        } catch (error) {
            console.error("Erro ao processar imagens:", error);
            toast.error("Erro ao processar fotos. Tente novamente.");
        }
        setIsUploading(false);
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            fotos: prev.fotos.filter((_, i) => i !== index),
        }));
        toast.success("Foto removida com sucesso!");
    };

    return (
        <div className="space-y-4">
            <Label className="text-lg font-semibold">Fotos</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    {isUploading ? "Selecionando..." : "Adicionar Fotos"}
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                    Formatos aceitos: JPG, PNG, WEBP (máx 10)
                </p>
            </div>
            {formData.fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.fotos.map((foto, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={foto.dados}
                                alt={foto.nomeArquivo}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
