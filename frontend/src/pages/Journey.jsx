// Journey.jsx - Interactive cosmic journey page for LIGHTECHO
// Displays a selected element's 7-chapter story with lazy-loaded narration
// fetched from the backend API as the user scrolls.

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import chapters from "../data/chapters.json";

// ChapterCard component - handles lazy-loading narration when card enters viewport
// Uses IntersectionObserver to detect visibility and trigger the fetch callback
function ChapterCard({ chapter, element, narration, isLoading, onVisible, idx, totalChapters }) {
  const cardRef = useRef(null);
  const hasTriggered = useRef(false);

  // Use IntersectionObserver to detect when this card enters the viewport
  // and trigger the fetch callback exactly once
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When card becomes visible and we haven't fetched yet, trigger the callback
        if (entry.isIntersecting && !hasTriggered.current) {
          hasTriggered.current = true;
          onVisible();
        }
      },
      { threshold: 0, rootMargin: "100px" } // Trigger slightly before card is fully visible
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [onVisible]);

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Chapter card — two-column layout with left border */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-lg bg-white/5 border-l-4"
          style={{ borderLeftColor: element.color }}
        >

          {/* Left column: metadata (timestamp, title, description) */}
          <div className="flex flex-col">
            {/* Chapter timestamp in element color */}
            <div className="text-xs uppercase tracking-widest mb-2" style={{ color: element.color }}>
              {chapter.timestamp}
            </div>

            {/* Chapter title in white */}
            <h3 className="text-2xl font-semibold mb-3 text-white">
              {chapter.title}
            </h3>

            {/* Chapter description in soft gray */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {chapter.description}
            </p>
          </div>

          {/* Right column: narration text (lazy-loaded from backend) */}
          <div className="flex flex-col justify-start">
            {/* Show loading state or narration text */}
            {isLoading ? (
              // Loading indicator — pulsing text
              <div className="text-gray-500 italic animate-pulse">
                Loading narration...
              </div>
            ) : narration ? (
              // Fade-in narration text when loaded
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="text-gray-300 text-sm leading-relaxed"
              >
                {narration}
              </motion.p>
            ) : (
              // Placeholder before fetch is triggered
              <div className="text-gray-600 text-sm italic">
                Scroll to reveal the narration...
              </div>
            )}
          </div>

        </div>
      </motion.div>

      {/* Subtle divider line between chapters (except after last) */}
      {idx < totalChapters - 1 && (
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mt-8" />
      )}
    </>
  );
}

export default function Journey() {
  // Get the element object passed from ElementPicker via location.state
  const location = useLocation();
  const navigate = useNavigate();
  const element = location.state?.element;

  // Redirect to /elements if no element was provided (shouldn't happen in normal flow)
  if (!element) {
    return (
      <div className="relative z-10 min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4">No element selected.</p>
          <button
            onClick={() => navigate("/elements")}
            className="text-[#C8A2FF] underline"
          >
            Back to element picker
          </button>
        </div>
      </div>
    );
  }

  // Get the 7 chapters for this element from the chapters data
  const elementChapters = chapters[element.symbol] || [];

  // State to store fetched narration text keyed by chapter id
  // { [chapterId]: "narration text here" }
  const [narrations, setNarrations] = useState({});
  const [loadingChapters, setLoadingChapters] = useState({});

  // Fetch narration from the backend when a chapter enters the viewport
  const fetchNarration = async (chapterId, elementName, chapterTitle) => {
    // Don't refetch if we already have this narration
    if (narrations[chapterId]) return;

    // Mark this chapter as loading
    setLoadingChapters((prev) => ({ ...prev, [chapterId]: true }));

    try {
      // Call the backend /narrate endpoint with element and chapter as query params
      const response = await fetch(
        `http://localhost:8000/narrate?element=${encodeURIComponent(
          elementName
        )}&chapter=${encodeURIComponent(chapterTitle)}`
      );
      const data = await response.json();

      // Store the returned story text under this chapter's id
      setNarrations((prev) => ({
        ...prev,
        [chapterId]: data.story || "No narration available.",
      }));
    } catch (error) {
      console.error("Failed to fetch narration:", error);
      setNarrations((prev) => ({
        ...prev,
        [chapterId]: "Could not load narration. Please try again.",
      }));
    } finally {
      setLoadingChapters((prev) => ({ ...prev, [chapterId]: false }));
    }
  };

  return (
    <div className="relative z-10 min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back button — top left navigation */}
        <button
          onClick={() => navigate("/elements")}
          className="mb-8 text-sm text-[#C8A2FF] hover:underline"
        >
          ← Back to Elements
        </button>

        {/* Element header: symbol, name, cosmic subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Element symbol — very large, in the element's color */}
          <div
            className="text-8xl font-bold mb-2"
            style={{ color: element.color }}
          >
            {element.symbol}
          </div>

          {/* Element name — white, large */}
          <h1 className="text-4xl font-normal mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {element.name}
          </h1>

          {/* Cosmic tagline */}
          <p className="text-white/60">A 13.8 billion year story</p>
        </motion.div>

        {/* Chapter cards — stacked vertically with space between */}
        <div className="space-y-8">
          {elementChapters.map((chapter, idx) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              element={element}
              narration={narrations[chapter.id]}
              isLoading={loadingChapters[chapter.id]}
              idx={idx}
              totalChapters={elementChapters.length}
              // onVisible callback is triggered when card enters viewport via IntersectionObserver
              onVisible={() =>
                fetchNarration(chapter.id, element.name, chapter.title)
              }
            />
          ))}
        </div>

      </div>
    </div>
  );
}
