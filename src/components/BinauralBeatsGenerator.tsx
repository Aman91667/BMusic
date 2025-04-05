import React, { useState } from "react";
import axios from "axios";

const BinauralBeatsGenerator: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [dimensionality, setDimensionality] = useState(4);
  const [loading, setLoading] = useState(false);
  const [audioUrls, setAudioUrls] = useState<{
    original?: string;
    mixed?: string;
  }>({});

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcess = async () => {
    if (!file) {
      alert("Please upload a file first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("dimensionality", dimensionality.toString());

      const response = await axios.post("https://binaural-backend.onrender.com/api/process", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { original, processed } = response.data;

      setAudioUrls({
        original: `data:audio/mp3;base64,${original}`,
        mixed: `data:audio/mp3;base64,${processed}`,
      });
    } catch (err) {
      console.error("Processing failed", err);
      alert("Error processing audio.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-700 via-pink-500 to-indigo-700 animate-gradient-shift">
      <div className="w-full max-w-xl text-white bg-black/60 backdrop-blur-md rounded-xl shadow-xl space-y-6 p-6">
        {/* 🎵 Waveform Animation */}
        <div className="flex justify-center h-12 items-end gap-1">
          {[...Array(32)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-purple-400 rounded-full animate-waveform"
              style={{
                height: `${10 + Math.random() * 90}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        <h1 className="text-3xl font-bold text-center mt-4">🎧 Music Dimensional Processor</h1>

        <input type="file" accept="audio/*" onChange={handleFileChange} className="w-full" />

        <label>Dimensionality (2D → 16D): {dimensionality}D</label>
        <input
          type="range"
          min="2"
          max="16"
          step="1"
          value={dimensionality}
          onChange={(e) => setDimensionality(Number(e.target.value))}
          className="w-full"
        />

        <button
          onClick={handleProcess}
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700 transition px-6 py-2 rounded-full font-medium disabled:opacity-50"
        >
          {loading ? "Processing..." : "Generate Immersive Version"}
        </button>

        {audioUrls.original && (
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Original</h3>
              <audio controls src={audioUrls.original} className="w-full" />
            </div>
            <div>
              <h3 className="font-semibold">Final Mix</h3>
              <audio controls src={audioUrls.mixed} className="w-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BinauralBeatsGenerator;
