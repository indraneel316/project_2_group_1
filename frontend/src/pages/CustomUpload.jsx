import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import Particles from "react-tsparticles";
import { loadFirePreset } from "tsparticles-preset-fire";
import "./CustomUpload.css";
import {getApiUrl} from "../util/ApiUrl";

const CustomUpload = ({ onUploadComplete }) => {
    const [selectedFile, setSelectedFile] = useState(null); // Stores selected file
    const [uploadPreview, setUploadPreview] = useState(""); // Stores preview URL
    const [error, setError] = useState(""); // Error message
    const [loading, setLoading] = useState(false); // Upload status

    const { user } = useContext(UserContext);

    // Handle file selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ["image/jpeg", "image/png"]; // Allowed file types
            if (!validTypes.includes(file.type)) {
                setError("Invalid file type. Please upload a JPEG or PNG image.");
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setError("File size exceeds 5MB. Please choose a smaller image.");
                return;
            }
            setSelectedFile(file); // Store selected file
            setUploadPreview(URL.createObjectURL(file)); // Create preview
            setError(""); // Clear any previous errors
        }
    };

    // Handle upload
    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Please select a photo");
            return;
        }

        const formData = new FormData();
        formData.append("photo", selectedFile);

        setLoading(true);
        setError("");

        try {
            const apiUrl = await getApiUrl();

            const response = await axios.put(
                `${apiUrl}/api/users/add-photo/${user.email}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            if (onUploadComplete) onUploadComplete(response.data.photos);
            setSelectedFile(null);
            setUploadPreview("");
        } catch (err) {
            console.error("Error uploading photo:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to upload photo.");
        } finally {
            setLoading(false);
        }
    };

    // Particle background animation with Fire preset
    const particlesInit = async (engine) => {
        await loadFirePreset(engine);
    };

    return (
        <div className="custom-upload-container">
            {/* Fire effect background */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    background: {
                        color: "transparent",
                    },
                    particles: {
                        color: {
                            value: ["#ffffff", "#ffcc00", "#ff5500"],
                        },
                        number: {
                            value: 100,
                        },
                        move: {
                            enable: true,
                            speed: 2,
                        },
                        size: {
                            value: { min: 2, max: 4 },
                        },
                    },
                }}
            />

            <div className="upload-card">
                <h4 className="upload-title">Post a Picture For Recipe Ideas 😋</h4>
                {error && <div className="error-message">{error}</div>}

                {uploadPreview && (
                    <div className="preview-container">
                        <img
                            src={uploadPreview}
                            alt="Preview"
                            className="preview-image"
                        />
                    </div>
                )}

                {/* File Input */}
                <div className="file-input-wrapper">
                    <input
                        type="file"
                        id="file-input"
                        className="file-input"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="file-input" className="file-label">
                        {selectedFile ? "Change Photo" : "Upload Photo"}
                    </label>
                </div>

                {selectedFile && (
                    <button
                        className={`upload-button ${loading ? "disabled" : ""}`}
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Post"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CustomUpload;                
