// ElementPicker.jsx - Interactive element selection page for LIGHTECHO
// Users browse elements organized by their cosmic origin and select one
// to hear its story via the narration API.

import { motion } from "framer-motion";
import elements from "../data/elements.json";

// Map category keys to human-readable display names.
const categoryNames = {
  big_bang: "Born in the Big Bang",
  star_born: "Born in Stars",
  stellar_giants: "Born in Stellar Giants",
  cosmic_violence: "Born in Cosmic Violence",
};

// Order categories for consistent layout.
const categoryOrder = ["big_bang", "star_born", "stellar_giants", "cosmic_violence"];

// Group elements by their category field.
// This creates an object with category keys and arrays of elements as values.
const groupElementsByCategory = () => {
  const grouped = {};
  categoryOrder.forEach((cat) => {
    grouped[cat] = elements.filter((el) => el.category === cat);
  });
  return grouped;
};

// Motion variants for staggered card entrance.
const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Small delay between each card
      delayChildren: 0.2,
    },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

// Individual element card component.
// Shows symbol prominently, name and teaser on hover.
function ElementCard({ element }) {
  return (
    <motion.div variants={cardVariant}>
      <div
        className={
          "relative h-40 w-full rounded-lg bg-white/5 border-2 border-opacity-30 " +
          "hover:border-opacity-100 transition-all duration-300 cursor-pointer " +
          "flex flex-col items-center justify-center p-4 group"
        }
        style={{ borderColor: element.color }}
      >
        {/* Element symbol — always visible and large */}
        <div
          className="text-4xl font-bold mb-2 transition-opacity duration-300 group-hover:opacity-0"
          style={{ color: element.color }}
        >
          {element.symbol}
        </div>

        {/* Element name and teaser — appears on hover */}
        <div
          className={
            "absolute inset-0 flex flex-col items-center justify-center p-3 " +
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center"
          }
        >
          <div className="text-white font-semibold mb-2">{element.name}</div>
          <div className="text-white/70 text-xs leading-tight">
            {element.teaser}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ElementPicker() {
  const groupedElements = groupElementsByCategory();

  return (
    <div className="relative z-10 min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Page title — Playfair Display serif for elegance */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-2"
        >
          <h1
            className="text-5xl md:text-6xl text-white font-normal mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Choose Your Element
          </h1>
        </motion.div>

        {/* Subtitle — soft white, centered context */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-white/70 text-center mb-12 max-w-2xl mx-auto"
        >
          Each atom has a different origin. Each story is unique.
        </motion.p>

        {/* Category sections — one per cosmic origin */}
        {categoryOrder.map((categoryKey) => {
          const categoryElements = groupedElements[categoryKey];
          const categoryColor = categoryElements[0]?.color; // All in category share color

          return (
            <div key={categoryKey} className="mb-12">

              {/* Category label in its theme color */}
              <div className="mb-4">
                <h2
                  className="text-lg font-semibold uppercase tracking-widest"
                  style={{ color: categoryColor }}
                >
                  {categoryNames[categoryKey]}
                </h2>
              </div>

              {/* Grid of element cards with staggered animation */}
              <motion.div
                variants={containerVariant}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {categoryElements.map((element) => (
                  <ElementCard key={element.symbol} element={element} />
                ))}
              </motion.div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
