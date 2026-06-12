import "../styles/home.css";
import api from "../services/api";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function SearchBar() {
    const [videoUrl, setVideoUrl] = useState("");
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const isValidYoutubeUrl = (url) => {
        const regex =
            /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}/;

        return regex.test(url);
    };

    const handleSearch = async () => {

        setError("");

        if (!videoUrl.trim()) {
            setError("Please enter a YouTube URL.")
            return;
        }

        if (!isValidYoutubeUrl(videoUrl)) {
            setError("Please enter a valid YouTube URL")
            return;
        }

        try {
            const response = await api.post("/video/validate", {
                url: videoUrl,
            });

            console.log("Backend Response : ", response.data);
            if (response.data.success) {
                navigate("/video", {
                    state: {
                        videoUrl,
                    },
                });
            } else {
                setError(response.data.message);
            }
        } catch (error) {
            console.error(error);
            setError("Unable to connect to the server. Please try again.")
        }
    };

    return (
        <>
            <div className="search-bar">
                <input type="text" placeholder="Search or paste a YouTube link here..." value={videoUrl} onChange={(e) => { setVideoUrl(e.target.value); setError(""); }} />

                <button onClick={handleSearch}>→</button>
            </div>

            {error && <p className="error">{error}</p>}
        </>
    );
}

export default SearchBar;