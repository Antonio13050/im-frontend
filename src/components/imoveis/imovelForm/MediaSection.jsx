import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Video, Image } from "lucide-react";
import { toast } from "sonner";

const MAX_VIDEO_SIZE_MB = 50;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
const MAX_VIDEOS = 3;
const MAX_PHOTOS = 10;

export default function MediaSection({ formData, setFormData }) {
    const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
    const [isUploadingVideos, setIsUploadingVideos] = useState(false);
    const photoInputRef = useRef();
    const videoInputRef = useRef();

    // ==================== FOTOS ====================
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        if (formData.fotos.length + files.length > MAX_PHOTOS) {
            toast.error(`Máximo de ${MAX_PHOTOS} fotos permitidas`);
            return;
        }

        setIsUploadingPhotos(true);
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
        setIsUploadingPhotos(false);
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            fotos: prev.fotos.filter((_, i) => i !== index),
        }));
        toast.success("Foto removida com sucesso!");
    };

    // ==================== VÍDEOS ====================
    const handleVideoUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        const currentVideos = formData.videos || [];
        if (currentVideos.length + files.length > MAX_VIDEOS) {
            toast.error(`Máximo de ${MAX_VIDEOS} vídeos permitidos`);
            return;
        }

        // Validar tamanho dos vídeos
        const oversizedFiles = files.filter((file) => file.size > MAX_VIDEO_SIZE_BYTES);
        if (oversizedFiles.length > 0) {
            toast.error(`Cada vídeo deve ter no máximo ${MAX_VIDEO_SIZE_MB}MB`);
            return;
        }

        setIsUploadingVideos(true);
        try {
            const newVideos = files.map((file) => ({
                id: null,
                nomeArquivo: file.name,
                dados: URL.createObjectURL(file),
                file: file,
                tamanho: file.size,
            }));
            setFormData((prev) => ({
                ...prev,
                videos: [...(prev.videos || []), ...newVideos],
            }));
            toast.success("Vídeos selecionados com sucesso!");
        } catch (error) {
            console.error("Erro ao processar vídeos:", error);
            toast.error("Erro ao processar vídeos. Tente novamente.");
        }
        setIsUploadingVideos(false);
    };

    const removeVideo = (index) => {
        setFormData((prev) => ({
            ...prev,
            videos: (prev.videos || []).filter((_, i) => i !== index),
        }));
        toast.success("Vídeo removido com sucesso!");
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        }
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="space-y-8">
            {/* ==================== SEÇÃO DE FOTOS ==================== */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Image className="w-5 h-5 text-blue-600" />
                    <Label className="text-lg font-semibold">Fotos</Label>
                    <span className="text-sm text-gray-500">
                        ({formData.fotos.length}/{MAX_PHOTOS})
                    </span>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                        ref={photoInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => photoInputRef.current?.click()}
                        disabled={isUploadingPhotos || formData.fotos.length >= MAX_PHOTOS}
                        className="flex items-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {isUploadingPhotos ? "Selecionando..." : "Adicionar Fotos"}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                        Formatos aceitos: JPG, PNG, WEBP (máx {MAX_PHOTOS})
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

            {/* ==================== SEÇÃO DE VÍDEOS ==================== */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-600" />
                    <Label className="text-lg font-semibold">Vídeos</Label>
                    <span className="text-sm text-gray-500">
                        ({(formData.videos || []).length}/{MAX_VIDEOS})
                    </span>
                </div>
                <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center bg-purple-50/50">
                    <input
                        ref={videoInputRef}
                        type="file"
                        multiple
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => videoInputRef.current?.click()}
                        disabled={isUploadingVideos || (formData.videos || []).length >= MAX_VIDEOS}
                        className="flex items-center gap-2 border-purple-300 hover:bg-purple-100"
                    >
                        <Video className="w-4 h-4" />
                        {isUploadingVideos ? "Selecionando..." : "Adicionar Vídeos"}
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                        Formatos aceitos: MP4, MOV, AVI (máx {MAX_VIDEOS} vídeos, {MAX_VIDEO_SIZE_MB}MB cada)
                    </p>
                </div>
                {(formData.videos || []).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {formData.videos.map((video, index) => (
                            <div
                                key={index}
                                className="relative group bg-gray-900 rounded-lg overflow-hidden"
                            >
                                <video
                                    src={video.dados}
                                    className="w-full h-32 object-cover"
                                    muted
                                    preload="metadata"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                    <p className="text-white text-xs truncate">
                                        {video.nomeArquivo}
                                    </p>
                                    <p className="text-gray-300 text-xs">
                                        {formatFileSize(video.tamanho || video.file?.size || 0)}
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                    onClick={() => removeVideo(index)}
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </Button>
                                {/* Play indicator */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
