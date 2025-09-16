import React, { useState } from "react";
import axios from "axios";

const AddRoom = () => {
    const [newRoom, setNewRoom] = useState({
        fotos: [], // Changed to array for multiple files
        titulo: "", // Added for ImovelDTO
        roomType: "",
        roomPrice: "",
    });

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [imagePreviews, setImagePreviews] = useState([]); // Array for multiple image previews

    const addRoom = async (fotos, titulo, roomType, roomPrice) => {
        const imovel = {
            titulo: titulo || "Default Title",
        };
        const formData = new FormData();
        // Append multiple files under 'fotos'
        if (fotos && fotos.length > 0) {
            fotos.forEach((file, index) => {
                formData.append("fotos", file);
            });
        }
        // Append imovel as JSON Blob
        formData.append(
            "imovel",
            new Blob([JSON.stringify(imovel)], { type: "application/json" })
        );

        const response = await axios.post(
            "http://localhost:8082/api/imoveis",
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        if (response.status === 201) {
            // Updated to match backend's 200 OK
            return true;
        } else {
            return false;
        }
    };

    const handleRoomInputChange = (e) => {
        const name = e.target.name;
        let value = e.target.value;
        if (name === "roomPrice") {
            if (!isNaN(value) && value !== "") {
                value = parseFloat(value).toFixed(2); // Ensure decimal format for price
            } else {
                value = "";
            }
        }
        setNewRoom({ ...newRoom, [name]: value });
    };

    const handleImageChange = (e) => {
        const selectedImages = Array.from(e.target.files); // Convert FileList to array
        setNewRoom({ ...newRoom, fotos: selectedImages });
        // Generate previews for all selected images
        const previews = selectedImages.map((file) =>
            URL.createObjectURL(file)
        );
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const success = await addRoom(
                newRoom.fotos,
                newRoom.titulo,
                newRoom.roomType,
                newRoom.roomPrice
            );
            if (success) {
                setSuccessMessage("A new room was added successfully!");
                setNewRoom({
                    fotos: [],
                    titulo: "",
                    roomType: "",
                    roomPrice: "",
                });
                setImagePreviews([]);
                setErrorMessage("");
            } else {
                setErrorMessage("Error adding new room");
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
        setTimeout(() => {
            setSuccessMessage("");
            setErrorMessage("");
        }, 3000);
    };

    return (
        <>
            <section className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <h2 className="mt-5 mb-2">Add a New Room</h2>
                        {successMessage && (
                            <div className="alert alert-success fade show">
                                {successMessage}
                            </div>
                        )}
                        {errorMessage && (
                            <div className="alert alert-danger fade show">
                                {errorMessage}
                            </div>
                        )}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label
                                    htmlFor="roomPrice"
                                    className="form-label"
                                >
                                    Room Price
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    id="roomPrice"
                                    name="roomPrice"
                                    value={newRoom.roomPrice}
                                    onChange={handleRoomInputChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="fotos" className="form-label">
                                    Room Photos (Select multiple)
                                </label>
                                <input
                                    name="fotos"
                                    id="fotos"
                                    type="file"
                                    className="form-control"
                                    onChange={handleImageChange}
                                    multiple // Allow multiple file selection
                                />
                                {imagePreviews.length > 0 && (
                                    <div className="mt-3">
                                        {imagePreviews.map((preview, index) => (
                                            <img
                                                key={index}
                                                src={preview}
                                                alt={`Preview room photo ${
                                                    index + 1
                                                }`}
                                                style={{
                                                    maxWidth: "200px",
                                                    maxHeight: "200px",
                                                    margin: "5px",
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="d-grid gap-2 d-md-flex mt-2">
                                <button
                                    type="submit"
                                    className="btn btn-outline-primary"
                                >
                                    Save Room
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AddRoom;
