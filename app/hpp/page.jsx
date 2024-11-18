"use client";

import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function VoiceTransformer() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [text, setText] = useState("");
  const [newVoiceUrl, setNewVoiceUrl] = useState("");

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["audio/mpeg", "audio/wav"];

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      toast.error("Oops, this file is too big or not supported! Please try again.");
      return false;
    }
    return true;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && validateFile(file)) {
      setUploadedFile(file);
      toast.success("File uploaded successfully!");
    }
  };

  const handleGenerateVoice = () => {
    if (!uploadedFile || !text.trim()) {
      toast.error("Please upload a file and enter text!");
      return;
    }

    toast.loading("Processing...");
    setTimeout(() => {
      const blob = new Blob(["Simulated voice file content"], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setNewVoiceUrl(url);
      toast.dismiss();
      toast.success("Voice file generated!");
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-blue-100 to-purple-200 p-10">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-4xl space-y-8">
        <h1 className="text-5xl font-extrabold text-indigo-600 text-center mb-6">
          Voice Transformer
        </h1>

        {/* Step 1: Upload Voice File */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">1. Upload Voice File</h2>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="w-full border-2 border-dashed border-indigo-300 p-4 rounded-lg bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Step 2: Enter Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">2. Enter Text (up to 500 characters)</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
            placeholder="Type your text here..."
            className="w-full h-32 border-2 border-indigo-300 p-4 rounded-lg bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
          <p className="text-right text-sm text-gray-600">Characters: {text.length} / 500</p>
        </div>

        {/* Step 3: Generate New Voice */}
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold text-gray-800">3. Generate New Voice</h2>
          <button
            onClick={handleGenerateVoice}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg text-xl font-semibold hover:opacity-90 transition"
          >
            Create New Voice File
          </button>
        </div>

        {/* Step 4: Download New Voice File */}
        {newVoiceUrl && (
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-gray-800">4. Download New Voice File</h2>
            <a
              href={newVoiceUrl}
              download="new-voice.mp3"
              className="w-full block bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg text-xl font-semibold text-center hover:opacity-90 transition"
            >
              Download Voice File
            </a>
          </div>
        )}

        <Toaster position="top-center" />
      </div>
    </div>
  );
}
