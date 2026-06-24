import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import axios from "axios";
import connectDB from "./config/db.js";
import Chat from "./models/Chat.js";
import { YoutubeTranscript } from "youtube-transcript";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);


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

app.post("/api/video/transcript", async (req, res) => {
    try {

        const { videoId } = req.body;

        if(!videoId) {
            return res.status(400).json({
                success: false,
                message: "Video ID is required"
            });
        }

        const transcript = await YoutubeTranscript.fetchTranscript(videoId);

        return res.json({
            success: true,
            transcript
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Transcript not available"
        });
    }
});

app.post("/api/video/summary", async (req, res) => {
    try {
        const { transcript } = req.body;

        if(!transcript) {
            return res.status(400).json({
                success: false,
                message: "Transcript is required",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
        Summarize the following YouTube transcript.
        
        Give:
        - A concise summary
        - Key points in bullet form
        
        Transcript:
        ${transcript}
        `;

        const result = await model.generateContent(prompt);

        const summary = result.response.text();

        return res.json({
            success: true,
            summary,
        });
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate summary",
        });
    }
});

app.post("/api/video/notes", async (req, res) => {
    try {

        const { transcript } = req.body;

        if(!transcript) {
            return res.status(400).json({
                success: false,
                message: "Transcript is required"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });

        const prompt = `
        Create detailed study notes from the following YouTube transcript.
        
        Format:
        #Main Concepts
        #Detailed Notes
        #Important Takeaways
        #Quick Revision Points
        
        Transcript:
        ${transcript}
        `;

        const result = await model.generateContent(prompt);
        const notes = result.response.text();
        return res.json({
            success: true,
            notes,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate notes",
        });
    }
});

app.post("/api/video/chat", async (req, res) => {
    try {

        const {videoId, transcript, question} = req.body;

        if(!transcript || !question){
            return res.status(400).json({
                success: false,
                message: "Transcript and question are required",
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
        });


        const prompt = `
        You are an AI assistant.
        
        Answer ONLY using the information present in the transcript.
        
        Transcript:
        ${transcript}
        
        Question:
        ${question}
        `;

        const result = await model.generateContent(prompt);

        const answer = result.response.text();

        let chat = await Chat.findOne({
            videoId
        });

        if(!chat) {
            chat = new Chat({
                videoId,
                messages: []
            });
        }

        chat.messages.push({
            role: "user",
            text: question
        });

        chat.messages.push({
            role: "assistant",
            text: answer
        });

        await chat.save();

        return res.json({
            success: true,
            answer,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to generate answer",
        });
    }
});

app.get("/api/video/chat/:videoId", async (req, res) => {
    const chat = await Chat.findOne({
        videoId: req.params.videoId
    });

    res.json({
        success: true,
        messages: chat?.messages || []
    });
});

connectDB();

app.listen(5000, () => {
    console.log("Server runnning on port 5000");
});