import "../styles/videoRoom.css"
import React, { useState } from "react";
function Tabs() {

  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="tab-content">
      <div className="tabs">
        <button className={activeTab === "chat" ? "active" : ""} onClick={() => setActiveTab("chat")}>Chat</button>
        <button className={activeTab === "summary" ? "active" : ""} onClick={() => setActiveTab("summary")}>Summary</button>
        <button className={activeTab === "transcript" ? "active" : ""} onClick={() => setActiveTab("transcript")}>Transcript</button>
        <button className={activeTab === "notes" ? "active" : ""} onClick={() => setActiveTab("notes")}>Notes</button>
      </div>

      <div>
        {activeTab === "chat" && <p>Chat UI coming soon...</p>}
        {activeTab === "summary" && <p>Summary coming soon...</p>}
        {activeTab === "transcript" && <p>Transcript coming soon...</p>}
        {activeTab === "notes" && <p>Notes coming soon...</p>}
      </div>
    </div>
  );
}

export default Tabs;