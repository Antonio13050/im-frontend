import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewImovel = () => {
    const [imoveis, setImoveis] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const fetchImoveis = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8082/api/imoveis"
                );
                setImoveis(response.data);
            } catch (error) {
                console.error("Error fetching imoveis:", error);
                setErrorMessage("Failed to load imoveis: " + error.message);
            }
        };
        fetchImoveis();
    }, []);

    return (
        <section className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <h2 className="mt-5 mb-2">Imóveis</h2>
                    {errorMessage && (
                        <div className="alert alert-danger fade show">
                            {errorMessage}
                        </div>
                    )}
                    {imoveis.length === 0 && !errorMessage && (
                        <p>No imóveis found.</p>
                    )}
                    {imoveis.map((imovel) => (
                        <div key={imovel.id} className="card mb-3">
                            <div className="card-body">
                                <h5 className="card-title">{imovel.titulo}</h5>
                                <p className="card-text">{imovel.descricao}</p>
                                {imovel.fotos && imovel.fotos.length > 0 ? (
                                    <div className="mt-3">
                                        {imovel.fotos.map((foto) => (
                                            <img
                                                key={foto.id}
                                                src={`data:${foto.tipoConteudo};base64,${foto.base64}`}
                                                alt={
                                                    foto.nomeArquivo ||
                                                    "Imóvel photo"
                                                }
                                                style={{
                                                    maxWidth: "200px",
                                                    maxHeight: "200px",
                                                    margin: "5px",
                                                    objectFit: "cover", // Optional: improve image display
                                                }}
                                                onError={(e) => {
                                                    console.error(
                                                        `Failed to load image ${foto.nomeArquivo}:`,
                                                        e
                                                    );
                                                    e.target.src =
                                                        "/path/to/fallback-image.jpg"; // Optional: fallback image
                                                }}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p>No photos available for this imóvel.</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ViewImovel;
