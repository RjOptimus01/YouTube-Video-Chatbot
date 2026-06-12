import React from "react";
import { useLocation } from "react-router-dom";

function VideoRoom() {
    const location = useLocation();
    const videoUrl = location.state?.videoUrl;

    return (
        <div>
            <h1>Video Room</h1>

            <h3>Youtube URL: </h3>
            
            <p>{videoUrl}</p>
        </div>
    );
}

export default VideoRoom;