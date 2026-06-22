import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";

import NavBar from "../components/Navbar";
import VideoPlayer from "../components/VideoPlayer";
import VideoInfo from "../components/VideoInfo";
import Tabs from "../components/Tabs";
import "../styles/videoRoom.css"

function VideoRoom() {
    const [transcript, setTranscript] = useState([]);
    const [loadingTranscript, setLoadingTranscript] = useState(false);
    const [summary, setSummary] = useState("");
    const [loadingSummary, setLoadingSummary] = useState(false);
    const playerRef = useRef(null);
    const location = useLocation();
    const videoUrl = location.state?.videoUrl;
    const video = location.state?.video;

    useEffect(() => {
        const fetchTranscript = async () => {

            if (!video?.videoId) return;

            try {
                setLoadingTranscript(true);

                const response = await api.post("/video/transcript", {
                    videoId: video.videoId,
                });

                if (response.data.success) {
                    setTranscript(response.data.transcript);
                }
            } catch (error) {
                console.log("Transcript Error : ", error);
            } finally {
                setLoadingTranscript(false);
            }
        };

        fetchTranscript();
    }, [video]);

    const fetchSummary = async () => {
        if (!transcript.length) return;

        if (summary) return;

        try {
            setLoadingSummary(true);

            const transcriptText = transcript
                .map(item => item.text)
                .join(" ");

            const response = await api.post("/video/summary", {
                transcript: transcriptText,
            });

            if (response.data.success) {
                setSummary(response.data.summary);
            }
        } catch (error) {
            console.log("Summary Error : ", error);
        } finally {
            setLoadingSummary(false);
        }
    };

    return (
        <>
            <NavBar />
            <div className="video-room">
                <div className="left-panel">
                    <VideoPlayer video={video} playerRef={playerRef}></VideoPlayer>
                    <VideoInfo video={video}></VideoInfo>
                </div>

                <div className="right-panel">
                    <Tabs transcript={transcript} loadingTranscript={loadingTranscript} summary={summary} loadingSummary={loadingSummary} fetchSummary={fetchSummary} playerRef={playerRef}></Tabs>
                </div>
            </div>
        </>
    );
}

export default VideoRoom;