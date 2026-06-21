import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import axios from "axios";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.post("/api/video/validate", async (req, res) => {
    try {
        const {url} = req.body;

        if(!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required",
            });
        }

        const match = url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
        );

        if(!match) {
            return res.status(400).json({
                success: false,
                message: "Invalid YouTube URL",
            });
        }

        const videoId = match[1];

        //call youtube datab api
        const youtubeResponse = await  axios.get(
            "https://www.googleapis.com/youtube/v3/videos",
            {
                params: {
                    part: "snippet",
                    id: videoId,
                    key: process.env.YOUTUBE_API_KEY,
                },
            }
        );

        //check if video exists
        if(!youtubeResponse.data.items || youtubeResponse.data.items.length === 0) {
            return res.json({
                success: false,
                message: "Video not found",
            });
        }
        
        const video = youtubeResponse.data.items[0];

        return res.json({
            success: true,
            message: "Video found",
            video: {
                videoId,
                title: video.snippet.title,
                channelTitle: video.snippet.channelTitle,
                thumbnail: video.snippet.thumbnails.high.url,
            },
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

app.listen(5000, () => {
    console.log("Server runnning on port 5000");
});