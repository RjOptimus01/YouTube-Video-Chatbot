# QueryTube – AI-Powered YouTube Video Chatbot

## Overview

QueryTube is an AI-powered YouTube learning assistant that allows users to interact with any YouTube video through transcript-based conversations, AI-generated summaries, study notes, and timestamp navigation.

The application extracts video transcripts, generates learning resources using Google's Gemini API, and enables users to ask questions about the video content in a conversational format.

---

## Features

### Video Processing

* YouTube URL validation
* Video metadata retrieval using YouTube Data API
* Automatic transcript extraction

### AI-Powered Learning

* Transcript-based question answering
* AI-generated summaries
* AI-generated study notes
* Context-aware responses using Gemini API

### Interactive Transcript

* Timeline-based transcript view
* Clickable timestamps
* Direct video navigation through transcript timestamps

### Chat Experience

* Video-specific AI chatbot
* Suggested prompts for quick interaction
* Auto-scrolling chat interface

### Productivity Tools

* Copy summary functionality
* Copy notes functionality
* Download notes as PDF

### Data Persistence

* MongoDB integration
* Video-specific chat history
* Automatic restoration of previous conversations

### Responsive Design

* Desktop support
* Tablet support
* Mobile-friendly interface

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* React Markdown
* CSS3

### Backend

* Node.js
* Express.js
* REST APIs

### Database

* MongoDB
* Mongoose

### AI and External APIs

* Google Gemini API
* YouTube Data API
* YouTube Transcript API

### Additional Libraries

* jsPDF

---

## Project Architecture

```bash
client/
├── components/
├── pages/
├── services/
├── styles/
└── App.jsx

server/
├── config/
├── models/
├── routes/
└── server.js
```

## Installation

### Clone the Repository

```bash
git clone https://github.com/RjOptimus01/querytube.git
cd querytube
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

### Configure Environment Variables

Create a `.env` file inside the server directory:

```env
GEMINI_API_KEY=your_gemini_api_key
YOUTUBE_API_KEY=your_youtube_api_key
MONGODB_URI=your_mongodb_connection_string
```

### Run Backend

```bash
npm run dev
```

### Run Frontend

```bash
cd client
npm run dev
```

---

## Screenshots

Add screenshots of:

* Home Page
* Video Player Interface
* Chat Interface
* Summary Generation
* Notes Generation
* Transcript Navigation

---

## Future Enhancements

* User Authentication
* Chat History Sidebar
* Dark Mode
* RAG-Based Retrieval System
* Multi-Language Support
* Learning Dashboard

---

## Author

Rishabh Jain

B.Tech Computer Science and Engineering

GitHub: https://github.com/RjOptimus01

---

## Support

If you found this project useful, consider giving it a star on GitHub.
