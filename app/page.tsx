"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-lime-500";
const ACCENT_TEXT = "text-lime-400";
const ACCENT_BORDER = "border-lime-500/30";
const ACCENT_GLOW = "shadow-lime-500/20";

export default function BBQController() {
  const [protein, setProtein] = useState("");
  const [cutThickness, setCutThickness] = useState("");
  const [smokerType, setSmokerType] = useState("");
  const [ambientTemp, setAmbientTemp] = useState("");
  const [targetDoneness, setTargetDoneness] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!protein || !cutThickness || !smokerType || !ambientTemp || !targetDoneness) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ protein, cutThickness, smokerType, ambientTemp, targetDoneness }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>🔥</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Smoker & BBQ Controller</h1>
          <p className="text-sm text-gray-400">Low-and-slow BBQ temperature planner</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Protein</label>
            <input value={protein} onChange={e => setProtein(e.target.value)} placeholder="e.g., Brisket, Pork Shoulder, Ribs"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Cut Thickness</label>
            <input value={cutThickness} onChange={e => setCutThickness(e.target.value)} placeholder="e.g., 2 inches, 3 lbs flat"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Smoker Type</label>
            <select value={smokerType} onChange={e => setSmokerType(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select smoker type...</option>
              <option value="offset" className="bg-gray-900">Offset Wood-Fired</option>
              <option value="drum" className="bg-gray-900">Weber Drum</option>
              <option value="electric" className="bg-gray-900">Electric</option>
              <option value="pellet" className="bg-gray-900">Pellet Grill</option>
              <option value="kamado" className="bg-gray-900">Kamado (Big Green Egg)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Ambient Temperature (°F)</label>
            <input type="number" value={ambientTemp} onChange={e => setAmbientTemp(e.target.value)} placeholder="e.g., 75"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-lime-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Target Doneness</label>
            <select value={targetDoneness} onChange={e => setTargetDoneness(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-lime-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select doneness...</option>
              <option value="rare" className="bg-gray-900">Rare (125-130°F internal)</option>
              <option value="medium-rare" className="bg-gray-900">Medium Rare (135-140°F)</option>
              <option value="medium" className="bg-gray-900">Medium (145-150°F)</option>
              <option value="medium-well" className="bg-gray-900">Medium Well (155-160°F)</option>
              <option value="well-done" className="bg-gray-900">Well Done (165°F+)</option>
              <option value="falling-apart" className="bg-gray-900">Falling Apart Tender (195-205°F)</option>
            </select>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Generating Schedule..." : "Generate BBQ Plan"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your BBQ plan will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
