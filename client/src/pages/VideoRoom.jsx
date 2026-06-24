import React, { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";

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
    const [notes, setNotes] = useState("");
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loadingChat, setLoadingChat] = useState(false);
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

    const fetchNotes = async () => {
        if (!transcript.length) return;

        if (notes) return;

        try {
            setLoadingNotes(true);
            const transcriptText = transcript
                .map(item => item.text)
                .join(" ");

            const response = await api.post("/video/notes", {
                transcript: transcriptText,
            });

            if (response.data.success) {
                setNotes(response.data.notes);
            }
        } catch (error) {
            console.log("Notes Error : ", error);
        } finally {
            setLoadingNotes(false);
        }
    };

    const sendMessage = async (question) => {
        if (!question.trim()) {
            return;
        }

        const userMessage = {
            role: "user",
            text: question
        };

        setMessages(prev => [...prev, userMessage]);

        try {
            setLoadingChat(true);
            const transcriptText = transcript
                .map(item => item.text)
                .join(" ");

            const response = await api.post("/video/chat", {
                videoId: video.videoId,
                transcript: transcriptText,
                question
            });

            const aiMessage = {
                role: "assistant",
                text: response.data.answer,
            }

            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingChat(false);
        }
    };

    const copySummary = async () => {
        try {
            await navigator.clipboard.writeText(summary);
            alert("Summary copied!");
        } catch (error) {
            console.log(error);
        }
    };

    const copyNotes = async () => {
        try {
            await navigator.clipboard.writeText(notes);
            alert("Notes copied!");
        } catch (error) {
            console.log(error);
        }
    };

    const downloadNotes = () => {
        const doc = new jsPDF();
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(notes, 100);
        doc.text(lines, 10, 10);
        doc.save("youtube-notes.pdf");
    }

    useEffect(() => {
        if (!video?.videoId) return;

        const initializePlayer = () => {
            playerRef.current = new window.YT.Player("youtube-player", {
                events: {
                    onReady: () => {
                        console.log("Player Ready");
                    }
                }
            });
        };

        if (window.YT && window.YT.Player) {
            initializePlayer();
        } else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            document.body.appendChild(tag);

            window.onYouTubeIframeAPIReady = initializePlayer;
        }
    }, [video]);

    useEffect(() => {
        const loadChat = async () => {
            if(!video?.videoId) return;

            const response = await api.get(`/video/chat/${video.videoId}`);

            if(response.data.success){
                setMessages(response.data.messages);
            }
        };
        loadChat();
    }, [video]);

    return (
        <>
            <NavBar />
            <div className="video-room">
                <div className="left-panel">
                    <VideoPlayer video={video} playerRef={playerRef}></VideoPlayer>
                    <VideoInfo video={video}></VideoInfo>
                </div>

                <div className="right-panel">
                    <Tabs transcript={transcript}
                        loadingTranscript={loadingTranscript}
                        summary={summary}
                        loadingSummary={loadingSummary}
                        fetchSummary={fetchSummary}
                        notes={notes}
                        loadingNotes={loadingNotes}
                        fetchNotes={fetchNotes}
                        messages={messages}
                        loadingChat={loadingChat}
                        sendMessage={sendMessage}
                        copySummary={copySummary}
                        copyNotes={copyNotes}
                        downloadNotes={downloadNotes}
                        playerRef={playerRef}></Tabs>
                </div>
            </div>
        </>
    );
}

export default VideoRoom;