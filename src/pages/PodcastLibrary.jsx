import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Scene3D from '../components/Scene3D';
function HeroText() {
  const [displayText, setDisplayText] = useState("");
  const fullText = "Podcast Library";
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setDisplayText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(t);
    }, 100);
    return () => clearInterval(t);
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-6"
    >
      {/* Badge */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/30 mb-6"
        style={{ background: 'rgba(124,58,237,0.1)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
        <span className="text-purple-300 text-xs font-mono uppercase tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>
          AI Library
        </span>
      </motion.div>
      {/* Title */}
      <h1
        className="text-6xl sm:text-7xl md:text-8xl font-black mb-4 leading-none gradient-text"
        style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}
      >
        {displayText}
        <span className="typewriter-cursor text-purple-400 ml-1">|</span>
      </h1>
      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-black/40 text-base sm:text-lg max-w-md mx-auto leading-relaxed"
        style={{ fontFamily: 'DM Sans' }}
      >
        Browse and play your generated podcasts
      </motion.p>
    </motion.div>
  );
}
function StatsBar({ podcasts }) {
  const stats = [
    { label: 'Podcasts in library', value: podcasts.length },
    { label: 'Last updated', value: podcasts.length ? podcasts[0].createdAt : '-' },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
      className="flex flex-wrap justify-center gap-6 mt-10 mb-8"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.6 + i * 0.1 }}
          className="text-center"
        >
          <p className="text-black/70 text-lg font-bold" style={{ fontFamily: 'Syne' }}>{s.value}</p>
          <p className="text-black/20 text-xs" style={{ fontFamily: 'JetBrains Mono', fontFamily: 'DM Sans' }}>{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

import axios from "axios";

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

function PodcastCard({ podcast }) {
  const [showTranscript, setShowTranscript] = useState(false);
  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col gap-2"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">{podcast.title}</h2>
        <span className="text-xs text-gray-400">{podcast.createdAt}</span>
      </div>
      <p className="text-gray-700 mb-2">{podcast.description}</p>
      <audio controls src={podcast.audioUrl} className="w-full mb-2" />
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => setShowTranscript((v) => !v)}
        >
          {showTranscript ? "Hide Transcript" : "Show Transcript"}
        </button>
        <a
          href={podcast.audioUrl}
          download
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Download
        </a>
      </div>
      {showTranscript && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 p-3 bg-gray-100 rounded"
        >
          <pre className="whitespace-pre-wrap text-sm text-gray-800">
            {podcast.transcript}
          </pre>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function PodcastLibrary() {
  const [search, setSearch] = useState("");
  const [podcasts, setPodcasts] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    async function fetchPodcasts() {
      try {
        const jobsRes = await axios.get("/Results/list");
        const jobs = jobsRes.data.jobs || [];
        const podcastPromises = jobs.map(async (jobId) => {
          const res = await axios.get(`/Results/${jobId}`);
          return {
            id: jobId,
            title: res.data.title || `Podcast ${jobId}`,
            description: res.data.description || "No description.",
            audioUrl: res.data.audio_url,
            transcript: res.data.transcript,
            createdAt: res.data.created_at,
          };
        });
        const podcasts = await Promise.all(podcastPromises);
        setPodcasts(podcasts);
      } catch (err) {
        setPodcasts([]);
      }
    }
    fetchPodcasts();
  }, []);

  const filtered = podcasts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative min-h-screen" style={{ background: 'linear-gradient(135deg, #050508 0%, #0a0818 50%, #050508 100%)' }}>
      {/* 3D Background */}
      <Scene3D isGenerating={false} />

      {/* Radial spotlight */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 20%, rgba(124,58,237,0.12) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero section */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-16">
          <HeroText />
          <StatsBar podcasts={podcasts} />
          <div className="max-w-xl mx-auto mb-8">
            <button
              className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-500 text-xs bg-white/5 hover:bg-purple-500/10 transition pointer-events-auto"
              onClick={() => window.location.href = '/'}
            >
              Home
            </button>
          </div>
        </div>
        {/* Results */}
        <div className="max-w-2xl mx-auto">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 mt-12"
            >
            </motion.div>
          ) : (
            filtered.map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))
          )}
        </div>
        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="fixed bottom-0 left-0 right-0 z-20 pb-4 pointer-events-none"
        >
          <div className="flex justify-center gap-4">
            <div
              className="px-4 py-2 rounded-full border border-white/5 text-black/15 text-xs flex items-center gap-2"
              style={{ background: 'rgba(245,243,255,0.8)', backdropFilter: 'blur(20px)', fontFamily: 'JetBrains Mono' }}
            >
              <span className="w-1 h-1 rounded-full bg-purple-400 animate-pulse" />
              Powered by AI · AgentCast
            </div>
            {/* <button
              className="px-4 py-2 rounded-full border border-purple-500/30 text-purple-500 text-xs bg-white/5 hover:bg-purple-500/10 transition pointer-events-auto"
              onClick={() => window.location.href = '/'}
            >
              Home
            </button> */}
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
