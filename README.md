# 🚀 AI Photo Upgrader

A full-stack web app that enhances low-quality product images using **Real-ESRGAN** (4× AI upscaling) via the **Replicate API** — completely free.

---

## ✨ Features

| Feature | Details |
|---|---|
| 📤 Upload image | Drag & drop or click to browse |
| 👁 Live preview | See original before enhancing |
| ⚡ AI Enhancement | Real-ESRGAN 4× upscaling via Replicate |
| 🔄 Loading state | Animated spinner with progress bar |
| 🖼 Before/After view | Side-by-side comparison panels |
| 💾 Download button | Save enhanced image locally |
| ✂️ Background removal | Optional, via `rembg` (bonus feature) |

---

## 🗂 Folder Structure

```
ai-photo-upgrader/
├── backend/
│   ├── main.py              ← FastAPI app with /enhance endpoint
│   ├── requirements.txt     ← Python dependencies
│   ├── .env.example         ← Copy to .env and add your API key
│   └── .env                 ← (you create this — git-ignored)
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.jsx               ← Main app component
    │   ├── index.js              ← React entry point
    │   ├── index.css             ← Tailwind + custom styles
    │   ├── components/
    │   │   ├── UploadZone.jsx    ← Drag & drop file input
    │   │   ├── ImagePanel.jsx    ← Before/After image panels
    │   │   └── LoadingSpinner.jsx← Animated loading state
    │   └── hooks/
    │       └── useEnhancer.js   ← API call logic (custom hook)
    ├── package.json
    ├── tailwind.config.js
    └── .env.example
```

---

## 🔑 Get Your FREE Replicate API Key

1. Go to **https://replicate.com** and sign up (free)
2. Navigate to **Account → API Tokens**
3. Create a new token and copy it
4. You get free credits on signup — more than enough to test!

---

## ⚙️ Setup Instructions

### 1. Backend (FastAPI)

```bash
# Navigate to backend folder
cd ai-photo-upgrader/backend

# Create a virtual environment (recommended)
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env

# Edit .env and paste your Replicate token:
# REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxx

# Run the server
uvicorn main:app --reload --port 8000
```

The API will be live at **http://localhost:8000**

You can test it at **http://localhost:8000/docs** (auto-generated Swagger UI)

---

### 2. Frontend (React)

```bash
# Open a NEW terminal and navigate to frontend
cd ai-photo-upgrader/frontend

# Install dependencies
npm install

# (Optional) Set backend URL in .env.local
cp .env.example .env.local
# REACT_APP_API_URL=http://localhost:8000

# Start the dev server
npm start
```

The app will open at **http://localhost:3000**

---

## 🧪 Example API Request

Using `curl`:

```bash
curl -X POST http://localhost:8000/enhance \
  -F "file=@/path/to/your/image.jpg" \
  -F "remove_background=false"
```

Expected response:

```json
{
  "success": true,
  "enhanced_url": "https://replicate.delivery/pbxt/...",
  "original_filename": "product.jpg",
  "background_removed": false
}
```

Using Python requests:

```python
import requests

with open("product.jpg", "rb") as f:
    response = requests.post(
        "http://localhost:8000/enhance",
        files={"file": ("product.jpg", f, "image/jpeg")},
        data={"remove_background": "false"}
    )

data = response.json()
print("Enhanced URL:", data["enhanced_url"])
```

---

## ✂️ Bonus: Enable Background Removal

To enable the "Remove Background" toggle:

1. Open `backend/requirements.txt`
2. Uncomment the `rembg` lines:
   ```
   rembg==2.0.57
   onnxruntime==1.18.0
   ```
3. Re-run: `pip install -r requirements.txt`
4. The toggle in the UI will now work end-to-end!

> **Note:** `rembg` downloads an AI model (~170MB) on first run.

---

## 🤖 AI Model Used

**nightmareai/real-esrgan**
- Model: `nightmareai/real-esrgan:f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa`
- Task: 4× image super-resolution
- Free to use on Replicate (with free credits)
- Replicate page: https://replicate.com/nightmareai/real-esrgan

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Tailwind CSS |
| Backend | Python FastAPI + Uvicorn |
| AI API | Replicate (Real-ESRGAN) |
| BG Removal | rembg + onnxruntime (optional) |
| HTTP Client | axios / fetch (frontend) · httpx (backend) |

---

## ❓ Troubleshooting

**CORS error in browser?**
→ Make sure the FastAPI server is running on port 8000 and you're opening React on port 3000.

**Replicate API error?**
→ Double-check your `REPLICATE_API_TOKEN` in `backend/.env`. Make sure there are no extra spaces.

**Image enhancement takes too long?**
→ Replicate free tier can take 20–60 seconds for cold starts. This is normal!

**rembg not found?**
→ Uncomment it in `requirements.txt` and re-install.

---

## 📄 License

MIT — free to use and modify.
