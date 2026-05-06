# Main API setup for the LIGHTECHO backend.
# This file exposes routes the frontend can call for status checks and narration.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from narrator import get_narration


# Create the FastAPI app instance.
# FastAPI uses this object to register routes and middleware.
app = FastAPI()


# Enable CORS so the Vite frontend at localhost:5173 can call this API from the browser.
# Without this, browser security blocks cross-origin requests by default.
app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:5173"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


# Health check endpoint.
# This gives a quick way to confirm the backend server is running.
@app.get("/")
def health_check() -> dict[str, str]:
	return {"message": "LIGHTECHO backend is running"}


# Narration endpoint.
# It receives `element` and `chapter` from query params, gets a generated narration,
# and returns it in a consistent JSON response shape for the frontend.
@app.get("/narrate")
async def narrate(element: str, chapter: str) -> dict[str, str]:
	result = await get_narration(element, chapter)
	return {"story": result}
