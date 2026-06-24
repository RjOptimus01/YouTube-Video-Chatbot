import "../styles/videoRoom.css"
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import ChatTab from "./ChatTab";
function Tabs({ transcript, loadingTranscript, summary, loadingSummary, fetchSummary, notes, loadingNotes, fetchNotes, messages, loadingChat, sendMessage, copySummary, copyNotes, downloadNotes, playerRef }) {

  const [activeTab, setActiveTab] = useState("chat");
  const [displayedSummary, setDisplayedSummary] = useState("");
  const [displayedNotes, setDisplayedNotes] = useState("");

  useEffect(() => {
    if (!summary) return;

    let index = 1;

    setDisplayedSummary("");

    const interval = setInterval(() => {
      setDisplayedSummary(
        summary.slice(0, index)
      );

      index++;

      if (index > summary.length) {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [summary]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (!notes) return;

    let index = 1;
    setDisplayedNotes("");

    const interval = setInterval(() => {
      setDisplayedNotes(
        notes.slice(0, index)
      );

      index++;

      if (index > notes.length) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [notes]);

  const groupTranscript = (transcript) => {
    const grouped = [];

    let currentGroup = {
      time: 0,
      text: ""
    };

    transcript.forEach((item) => {

      if (item.offset - currentGroup.time < 25000) {
        currentGroup.text += " " + item.text;
      } else {
        grouped.push(currentGroup);

        currentGroup = {
          time: item.offset,
          text: item.text
        };
      }
    });

    grouped.push(currentGroup);

    return grouped;
  };

  const groupedTranscript = groupTranscript(transcript);

  return (
    <div className="tab-content">
      <div className="tabs">
        <button className={activeTab === "chat" ? "active" : ""} onClick={() => setActiveTab("chat")}>Chat</button>
        <button className={activeTab === "summary" ? "active" : ""} onClick={() => { setActiveTab("summary"); if (!loadingSummary) { fetchSummary(); } }}>Summary</button>
        <button className={activeTab === "transcript" ? "active" : ""} onClick={() => setActiveTab("transcript")}>Transcript</button>
        <button className={activeTab === "notes" ? "active" : ""} onClick={() => { setActiveTab("notes"); fetchNotes(); }}>Notes</button>
      </div>

      <div>
        {activeTab === "chat" && (
          <ChatTab messages={messages} loadingChat={loadingChat} sendMessage={sendMessage} />
        )}
        {activeTab === "summary" && (
          <div className="summary-container">

            {loadingSummary ? (
              <div className="summary-loading">
                <div className="loader"></div>
                <p>Generating Summary...</p>
              </div>
            ) : summary ? (
              <>
                <button className="copy-btn" onClick={copySummary}>Copy</button>
                <div className="summary-text"><ReactMarkdown>{displayedSummary}</ReactMarkdown></div>
              </>
            ) : (
              <p>Limit exceeds... Please try again after sometime...</p>
            )}
          </div>
        )}
        {activeTab === "transcript" && (
          <div className="transcript-container">
            {loadingTranscript ? (
              <p>Loading transcript...</p>
            ) : (
              groupedTranscript.map((item, index) => (
                <div key={index} className="transcript-item">

                  <span className="transcript-time" onClick={() => {
                    if (playerRef.current) {
                      playerRef.current.seekTo(item.time / 1000, true)
                    }
                  }}>{formatTime(item.time / 1000)}</span>

                  <div className="timeline-column">
                    <div className="timeline-dot"></div>

                    {index !== groupedTranscript.length - 1 && (
                      <div className="timeline-line"></div>
                    )}
                  </div>

                  <div className="transcript-text">{item.text}</div>

                </div>
              ))
            )}
          </div>
        )}
        {activeTab === "notes" && (
          <div className="summary-container">
            {loadingNotes ? (
              <div className="summary-loading">
                <div className="loader"></div>
                <p>Generating Notes...</p>
              </div>
            ) : notes ? (
              <>
                <div className="notes-action">
                  <button className="copy-btn" onClick={copyNotes}>Copy</button>
                  <button className="pdf-btn" onClick={downloadNotes}>Export PDF</button>
                </div>
                <div className="summary-text"><ReactMarkdown>{displayedNotes}</ReactMarkdown></div>
              </>
            ) : (
              <p>Limit exceeds... Please try again after sometime...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Tabs;