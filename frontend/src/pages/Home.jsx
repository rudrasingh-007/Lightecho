// Home.jsx - LIGHTECHO landing page
// This page sits above the persistent starfield background and provides
// an elegant, cinematic intro that invites the user to begin their journey.

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Motion variants for a slow, cinematic fade-up entrance (not bouncy).
const itemVariant = {
	hidden: { opacity: 0, y: 20 },
	visible: (delay = 0) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.8, ease: "easeOut", delay },
	}),
};

export default function Home() {
	// Use the React Router navigation hook to navigate to /elements when button is clicked.
	const navigate = useNavigate();

	return (
		// Full-screen centered container. Content has higher stacking context
		// (z-10) so it appears above the fixed StarField background.
		<div className="min-h-screen flex items-center justify-center relative z-10">
			<div className="text-center px-4">

				{/* Top small label: app name in nebula purple, spaced letters */}
				<motion.div
					initial="hidden"
					animate="visible"
					custom={0}
					variants={itemVariant}
				>
					<div className="text-[10px] tracking-widest text-[#C8A2FF] uppercase mb-6">
						LIGHTECHO
					</div>
				</motion.div>

				{/* Main headline: two lines, very large and bold, centered */}
				<motion.h1
					initial="hidden"
					animate="visible"
					custom={0.15}
					variants={itemVariant}
					// Use Playfair Display serif for a classic, literary headline.
					// Applied inline to ensure the font choice takes precedence while
					// keeping Tailwind's size classes (`text-5xl`/`md:text-6xl`).
					style={{ fontFamily: "'Playfair Display', serif" }}
					className="text-white font-normal leading-tight text-5xl md:text-6xl"
				>
					<div>You are not from Earth.</div>
					<div>You are from the stars.</div>
				</motion.h1>

				{/* Subtitle: soft white, constrained width for readability */}
				<motion.p
					initial="hidden"
					animate="visible"
					custom={0.3}
					variants={itemVariant}
					className="text-white/80 mt-6 mx-auto max-w-2xl text-base md:text-lg"
				>
					Every atom in your body was forged in a dying star billions of years ago.
					Choose an element. Hear its story.
				</motion.p>

				{/* Call-to-action button: transparent with nebula purple border and glow on hover */}
				<motion.div
					initial="hidden"
					animate="visible"
					custom={0.45}
					variants={itemVariant}
				>
					<button
						aria-label="Begin Your Journey"
						onClick={() => navigate("/elements")}
						className={
							"mt-8 inline-block rounded-full px-8 py-3 border border-[#C8A2FF] text-white bg-transparent " +
							"hover:bg-[#C8A2FF] transition-colors duration-300 focus:outline-none " +
							"ring-0 hover:ring-8 hover:ring-[#C8A2FF]/30"
						}
					>
						Begin Your Journey
					</button>
				</motion.div>

			</div>
		</div>
	);
}
