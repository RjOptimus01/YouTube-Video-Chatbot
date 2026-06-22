import "../styles/videoRoom.css"
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
function Tabs({ transcript, loadingTranscript, summary, loadingSummary,fetchSummary, playerRef }) {

  const [activeTab, setActiveTab] = useState("chat");
  const [displayedSummary, setDisplayedSummary] = useState("");

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
        <button className={activeTab === "summary" ? "active" : ""} onClick={() => {setActiveTab("summary"); if(!loadingSummary){fetchSummary();}}}>Summary</button>
        <button className={activeTab === "transcript" ? "active" : ""} onClick={() => setActiveTab("transcript")}>Transcript</button>
        <button className={activeTab === "notes" ? "active" : ""} onClick={() => setActiveTab("notes")}>Notes</button>
      </div>

      <div>
        {activeTab === "chat" && <p>Chat UI coming soon...</p>}
        {activeTab === "summary" && (
          <div className="summary-container">

            {loadingSummary ? (
              <div className="summary-loading">
                <div className="loader"></div>
                <p>Generating Summary...</p>
              </div>
            ) : summary ? (
              <div className="summary-text"><ReactMarkdown>{displayedSummary}</ReactMarkdown></div>
            ) : (
              <p>Generating summary...</p>
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

                  <span className="transcript-time">{formatTime(item.time / 1000)}</span>

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
        {activeTab === "notes" && <p>Notes coming soon...</p>}
      </div>
    </div>
  );
}

export default Tabs;