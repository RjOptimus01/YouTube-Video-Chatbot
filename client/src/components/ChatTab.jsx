import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

function ChatTab({messages, sendMessage, loadingChat}) {
    const [question, setQuestion] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const handleSend = () => {
        if(!question.trim()) return;
        sendMessage(question);
        setQuestion("");
    };

    return(
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                ))}

                {loadingChat && (
                    <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                )}

                <div ref={(messagesEndRef)}></div>
            </div>

            <div className="chat-input">
                <input type="text" placeholder="Ask about this video..." value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) =>{
                    if(e.key === "Enter"){
                        handleSend();
                    }
                }}/>
                <button onClick={handleSend} disabled={loadingChat}>{loadingChat? "Thinking..." : "Send"}</button>
            </div>

            <div className="suggestions">
                <button onClick={() => sendMessage("What is the main topic of this video?")}>Main Topic</button>
                <button onClick={() => sendMessage("Summarize this video in 5 points")}>5 Point Summary</button>
                <button onClick={() => sendMessage("What are the key takeaways")}>Key Takeaways</button>
            </div>
        </div>
    );
}

export default ChatTab;