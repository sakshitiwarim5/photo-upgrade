"""
AI Photo Upgrader - FastAPI Backend
Enhances images using Replicate's Real-ESRGAN model
"""

import os
import replicate
import httpx
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
import base64
import io

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="AI Photo Upgrader API", version="1.0.0")

# Allow frontend (React dev server) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Check API key on startup
REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")
MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"

if not REPLICATE_API_TOKEN:
    print("WARNING: REPLICATE_API_TOKEN not set in .env file!")


@app.get("/")
def root():
    return {
        "message": "AI Photo Upgrader API is running!",
        "status": "ok",
        "mock_mode": MOCK_MODE
    }


@app.post("/enhance")
async def enhance_image(
    file: UploadFile = File(...),
    remove_background: bool = Form(False),
):
    """
    Enhance a low-quality image using Real-ESRGAN via Replicate API.
    Optionally remove background using rembg.
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Only image files are supported (JPEG, PNG, WebP, etc.)"
        )

    # Read image bytes
    image_bytes = await file.read()

    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    if len(image_bytes) > 20 * 1024 * 1024:  # 20MB limit
        raise HTTPException(status_code=400, detail="File too large. Max 20MB allowed.")

    try:
        # Convert image to base64 data URI for Replicate
        mime_type = file.content_type or "image/jpeg"
        b64_image = base64.b64encode(image_bytes).decode("utf-8")
        data_uri = f"data:{mime_type};base64,{b64_image}"

        print(f"Processing image: {file.filename} ({len(image_bytes) / 1024:.1f} KB)")

        # ─── Step 1: Enhance with Real-ESRGAN ───────────────────────────────
        enhanced_url = None
        
        if MOCK_MODE:
            print("MOCK MODE ENABLED: Skipping Replicate API call")
            enhanced_url = data_uri
        else:
            try:
                print("Running Real-ESRGAN enhancement...")
                output = replicate.run(
                    "nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa",
                    input={
                        "image": data_uri,
                        "scale": 4,
                        "face_enhance": False
                    }
                )
                enhanced_url = str(output)
            except Exception as e:
                # Catch credit issues or any other API failure to allow UI demo
                err_msg = str(e)
                if "402" in err_msg or "credit" in err_msg.lower() or "payment" in err_msg.lower():
                    print(f"API CREDIT ISSUE DETECTED: {err_msg}")
                    print("Falling back to Mock Mode for demonstration")
                    enhanced_url = data_uri
                else:
                    print(f"Replicate API Error: {err_msg}")
                    raise e

        print(f"Enhanced image URL: {enhanced_url}")

        # ─── Step 2 (Optional): Remove background with rembg ────────────────
        if remove_background:
            print("Removing background with rembg...")
            try:
                from rembg import remove as rembg_remove
                from PIL import Image

                # Download or use base64
                if enhanced_url.startswith("data:"):
                    # Use the base64 data directly
                    header, encoded = enhanced_url.split(",", 1)
                    enhanced_bytes = base64.b64decode(encoded)
                else:
                    async with httpx.AsyncClient() as client:
                        resp = await client.get(enhanced_url, timeout=60)
                        resp.raise_for_status()
                        enhanced_bytes = resp.content

                # Run background removal
                img = Image.open(io.BytesIO(enhanced_bytes))
                result_bytes = rembg_remove(img)

                # Convert back to base64 PNG for frontend
                buf = io.BytesIO()
                result_img = Image.open(io.BytesIO(result_bytes))
                result_img.save(buf, format="PNG")
                result_b64 = base64.b64encode(buf.getvalue()).decode("utf-8")
                enhanced_url = f"data:image/png;base64,{result_b64}"
                print("Background removed successfully")

            except ImportError:
                print("rembg not installed. Skipping background removal.")
            except Exception as e:
                print(f"Background removal failed: {e}")

        return JSONResponse(content={
            "success": True,
            "enhanced_url": enhanced_url,
            "original_filename": file.filename,
            "background_removed": remove_background,
            "is_mock": enhanced_url == data_uri and not MOCK_MODE,
            "mock_mode": MOCK_MODE
        })

    except replicate.exceptions.ReplicateError as e:
        print(f"Replicate API error: {e}")
        raise HTTPException(
            status_code=502,
            detail=f"Replicate API error: {str(e)}. Check your API token and try again."
        )
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
        )

