"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, X } from "lucide-react";
import ChatMessage from "./chat-message";
import TypingIndicator from "./typing-indicator";
import { Rnd } from "react-rnd";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

function ChefModel({ scale = 1 }) {
  const { scene } = useGLTF("/models/chef.glb");
  return <primitive object={scene} scale={scale} />;
}

function ChefButton({ onClick }) {
  return (
    <div
      className="fixed bottom-6 right-0 w-100 h-100 cursor-pointer z-50"
      onClick={onClick}
    >
      <Canvas camera={{ position: [0, 1, 3] }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 2]} />
        <ChefModel scale={1.4} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={1.2} />
      </Canvas>
    </div>
  );
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);
  const handleInputChange = (e) => setInput(e.target.value);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && <ChefButton onClick={toggleChat} />}

      {isOpen && (
        <Rnd
          default={{
            x: window.innerWidth - 420,
            y: window.innerHeight - 550,
            width: 400,
            height: 500,
          }}
          minWidth={300}
          minHeight={400}
          bounds="window"
          className="z-40"
        >
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
            {/* Header with 3D model */}
            {/* Header with 3D model and title */}
            {/* Header with 3D model and title */}
            <div className="bg-gradient-to-r from-orange-500 to-green-500 h-40 flex items-center relative px-4">
              {/* 3D model on the left */}
              <div className="w-40 h-60 flex-shrink-0">
                <Canvas camera={{ position: [0, 1, 3] }}>
                  <ambientLight intensity={0.7} />
                  <directionalLight position={[2, 2, 2]} />
                  <ChefModel scale={1.4} />
                  <OrbitControls
                    enableZoom={false}
                    autoRotate
                    autoRotateSpeed={1}
                  />
                </Canvas>
              </div>

              {/* Title & Subtitle - centered */}
              <div className="flex flex-col items-center justify-center flex-1 text-white text-center">
                <h3 className="text-2xl font-bold">CookSmartAI Assistant</h3>
                <p className="text-sm opacity-90">
                  Your AI-powered cooking companion
                </p>
              </div>

              {/* Close button */}
              <button
                onClick={toggleChat}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow"
              >
                <X className="w-5 h-5 text-gray-800" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && <TypingIndicator />}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleFormSubmit} className="flex space-x-2">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask something..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-orange-500 hover:bg-orange-600 p-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        </Rnd>
      )}
    </>
  );
}
