"use client";

import { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function VoiceTextEntryPage() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const SpeechRecognition =
    typeof window !== "undefined" && window.SpeechRecognition || window.webkitSpeechRecognition;

  const handleChange = (value) => {
    const words = value.trim().split(/\s+/);
    const count = value ? words.length : 0;

    setText(value);
    setWordCount(count);
  };

  const handleSubmit = () => {
    if (wordCount > 500) {
      toast.error("Word limit exceeded! Please reduce your text.", {
        icon: "🚫",
      });
    } else {
      toast.success("Successfully entered!", {
        icon: "🎉",
      });
    }
  };

  const startListening = () => {
    if (!SpeechRecognition) {
      toast.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      toast("Listening...", { icon: "🎤" });
    };

    recognition.onerror = () => {
      toast.error("An error occurred while recognizing speech.");
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");
      handleChange(text + " " + transcript);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-6 text-center">
          Submit Your Text or Voice
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Enter up to <span className="font-semibold text-indigo-500">500</span> words. You can type or use voice input!
        </p>
        <textarea
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Start typing your text here..."
          className="w-full h-60 border-2 border-indigo-200 rounded-lg p-4 text-gray-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:border-indigo-400 placeholder-gray-400 transition-all"
        ></textarea>
        <div className="mt-4 flex justify-between items-center">
          <span className="text-gray-600">
            Word Count:{" "}
            <span
              className={`font-bold ${
                wordCount > 500 ? "text-red-500" : "text-indigo-500"
              }`}
            >
              {wordCount}
            </span>
            /500
          </span>
          <button
            onClick={startListening}
            disabled={isListening}
            className={`bg-gradient-to-r ${
              isListening
                ? "from-gray-300 to-gray-400 cursor-not-allowed"
                : "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700"
            } text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all`}
          >
            {isListening ? "Listening..." : "Start Voice Input"}
          </button>
        </div>
        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all"
        >
          Submit
        </button>
      </div>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
