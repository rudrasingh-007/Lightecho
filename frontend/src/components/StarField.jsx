// StarField.jsx - Animated 3D background star field for LIGHTECHO.
// Renders 8000 randomly positioned stars that slowly rotate, creating an immersive
	// sense of floating through space. The canvas sits behind all UI elements.

	import { Canvas, useFrame } from "@react-three/fiber";
	import { useRef } from "react";
	import * as THREE from "three";


	// Stars component that generates and animates the star geometry.
	// This is a child of the Canvas and handles all Three.js mesh logic.
	function Stars() {
		// Reference to the Points mesh so we can rotate it in the animation loop.
		const meshRef = useRef(null);

		// Create star geometry and material once (not every frame).
		// Using Points is more efficient than rendering individual spheres for 8000 stars.
		const starCount = 8000;

	// Generate random positions for all stars in a large sphere around the camera.
	// Spread them across a radius to simulate space depth.
	const positions = new Float32Array(starCount * 3);
	const colors = new Float32Array(starCount * 3);

	// Populate star positions and colors.
	for (let i = 0; i < starCount * 3; i += 3) {
		// Random position: spread across a 2000-unit radius sphere.
		positions[i] = (Math.random() - 0.5) * 2000; // x
		positions[i + 1] = (Math.random() - 0.5) * 2000; // y
		positions[i + 2] = (Math.random() - 0.5) * 2000; // z

		// Color variation: blend bright white and light blue for maximum visibility.
		// Each star gets one of two bright colors for a clean, vivid appearance.
		const colorChoice = Math.random();
		if (colorChoice < 0.7) {
			// Bright white stars (70% of total)
			colors[i] = 1;
			colors[i + 1] = 1;
			colors[i + 2] = 1;
		} else {
			// Bright light blue stars (30%)
			colors[i] = 0.9;
			colors[i + 1] = 0.95;
			colors[i + 2] = 1;
		}
	}

	// Create geometry and attach position and color attributes.
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

	// Create a small circular sprite texture using an offscreen Canvas.
	// This ensures points render as circular blobs instead of square fragments.
	const spriteSize = 64;
	const sprite = document.createElement("canvas");
	sprite.width = spriteSize;
	sprite.height = spriteSize;
	const spriteCtx = sprite.getContext("2d");

	// Draw a filled circle in the canvas; the rest remains transparent.
	// Using a gradient or slight softness could improve appearance, but a solid
	// circle is the simplest reliable approach across devices.
	spriteCtx.clearRect(0, 0, spriteSize, spriteSize);
	spriteCtx.fillStyle = "#ffffff";
	spriteCtx.beginPath();
	spriteCtx.arc(spriteSize / 2, spriteSize / 2, spriteSize / 2, 0, Math.PI * 2);
	spriteCtx.closePath();
	spriteCtx.fill();

	// Convert the canvas into a Three.js texture and ensure it's updated.
	const spriteTexture = new THREE.CanvasTexture(sprite);
	spriteTexture.minFilter = THREE.LinearFilter;
	spriteTexture.needsUpdate = true;

	// Use PointsMaterial with the circular sprite map and alphaTest to discard
	// transparent fragments. `transparent: true` allows proper blending on many platforms.
	// `vertexColors: true` ensures per-star color from the buffer attribute is used.
	const material = new THREE.PointsMaterial({
		size: 1.8,
		sizeAttenuation: true,
		map: spriteTexture,
		alphaTest: 0.5,
		transparent: true,
		vertexColors: true,
	});

	// Animation loop: slowly rotate the entire star field around the y-axis.
	// This creates the illusion of moving through space without camera movement.
	useFrame(() => {
		if (meshRef.current) {
			meshRef.current.rotation.y += 0.0003; // Steady rotation (0.0003 rad/frame) for visible movement
		}
	});

	// Render the Points mesh with our geometry and material.
	return <points ref={meshRef} geometry={geometry} material={material} />;
}


// StarField component: the main export that renders the Three.js Canvas.
// This wraps the Stars component and provides styling/configuration.
export default function StarField() {
	return (
		<Canvas
			// Camera positioned at origin looking down the z-axis.
			// The star sphere surrounds the camera so it feels immersive.
			camera={{ position: [0, 0, 0], fov: 75 }}

			// Container styling: position fixed so it covers the entire viewport.
			// z-index -1 places it behind all other page content.
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				zIndex: -1,
			}}

			// Prevent canvas from taking up layout space or interfering with clicks.
			gl={{ antialias: true }}
		>
			{/* Render our Stars component inside the Canvas. */}
			<Stars />
		</Canvas>
	);
}
