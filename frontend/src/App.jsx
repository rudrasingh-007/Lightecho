// App.jsx - Main LIGHTECHO routing and layout component.
// This component sets up the application structure with a persistent starfield
// background and client-side routing to navigate between pages.

import { BrowserRouter, Routes, Route } from "react-router-dom";
import StarField from "./components/StarField";
import Home from "./pages/Home";
import ElementPicker from "./pages/ElementPicker";
import Journey from "./pages/Journey";


// Main App component: the root of the entire application.
// Uses React Router to manage page navigation while keeping the starfield persistent.
function App() {
	return (
		// BrowserRouter enables client-side routing for all nested Routes.
		// This allows page navigation without full page reloads.
		<BrowserRouter>
			{/* StarField renders as a fixed background on all pages.
			    It has z-index -1, so it sits behind all page content. */}
			<StarField />

			{/* Page content container: relative positioning ensures content
			    layers properly on top of the fixed starfield background. */}
			<div className="relative min-h-screen">
				{/* Routes define which component to render for each URL path.
				    "/" is the home page; more routes can be added here as features expand. */}
				<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/elements" element={<ElementPicker />} />
				<Route path="/journey" element={<Journey />} />
			</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;