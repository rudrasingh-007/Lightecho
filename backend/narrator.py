# Gemini narrator module for LIGHTECHO.
# This file handles model configuration and generates story narration text.

import os

from google import genai
from google.genai import types
from dotenv import load_dotenv


# Load environment variables from a local .env file.
# This keeps secrets (like API keys) out of source code and version control.
load_dotenv()


# Read the Gemini API key from environment variables.
# Failing fast here makes configuration issues obvious during startup.
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
	raise ValueError("GEMINI_API_KEY is missing. Add it to backend/.env.")


# Create a reusable Gemini client configured with the project API key.
# Centralizing client setup avoids rebuilding connections on every request.
client = genai.Client(api_key=GEMINI_API_KEY)


# Define a single system instruction used for all narration calls.
# Keeping this as a constant ensures consistent voice and constraints per chapter.
SYSTEM_INSTRUCTION = (
	"You are a Carl Sagan style cosmic narrator. Be scientifically accurate, "
	"emotionally moving, and speak to atoms in second person. Limit every response "
	"to 3-4 sentences maximum."
)


# Pin the Gemini model so behavior is stable and explicit.
# This preview flash-lite model is optimized for fast, lightweight responses.
MODEL_NAME = "gemini-2.5-flash-lite"


# Generate narration text for an element and chapter context.
# The prompt frames each response as a cosmic journey so stories feel cohesive.
async def get_narration(element: str, chapter: str) -> str:
	prompt = (
		f"Element: {element}. Chapter: {chapter}. "
		"Tell the atom's journey in this chapter: from cosmic origin in stars to "
		"its role in planets, chemistry, and life. Address the atom as 'you'."
	)

	# Call the async Gemini endpoint so FastAPI can serve multiple requests efficiently.
	# The system instruction is passed in config to enforce narrator behavior each time.
	response = await client.aio.models.generate_content(
		model=MODEL_NAME,
		contents=prompt,
		config=types.GenerateContentConfig(system_instruction=SYSTEM_INSTRUCTION),
	)

	# Return the model text payload expected by the API route.
	# Fallback to empty string if the SDK returns no text content.
	return response.text or ""
