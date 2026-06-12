import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server Running");
});

app.post("/api/video/validate", (req, res) => {
    const { url } = req.body;

    if(!url) {
        return res.status(400).json({
            success: false,
            message: "URL is required"
        });
    }
    console.log(url);
    res.json({
        success: true,
        message: "URL received successfully"
    });
});

app.listen(5000, () => {
    console.log("Server runnning on port 5000");
});