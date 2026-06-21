import React from "react";
import { useLocation } from "react-router-dom";

import NavBar from "../components/Navbar";
import VideoPlayer from "../components/VideoPlayer";
import VideoInfo from "../components/VideoInfo";
import Tabs from "../components/Tabs";
import "../styles/videoRoom.css"

function VideoRoom() {
    const location = useLocation();
    const videoUrl = location.state?.videoUrl;
    const video = location.state?.video;

    return (
        <>
            <NavBar />
            <div className="video-room">
                <div className="left-panel">
                    <VideoPlayer video={video}></VideoPlayer>
                    <VideoInfo video={video}></VideoInfo>
                </div>

                <div className="right-panel">
                    <Tabs></Tabs>
                </div>
            </div>
        </>
    );
}

export default VideoRoom;