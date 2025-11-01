import io
import pickle
from pathlib import Path

from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
import PIL.Image
import PIL.ImageOps
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# Load model relative to this file so it works whether uvicorn is run from repo root
MODEL_PATH = Path(__file__).parent / "mnist_model.pkl"
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model file not found at {MODEL_PATH}. Run training or place the file there.")

with MODEL_PATH.open("rb") as f:
    model = pickle.load(f)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict-image/")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    pil_image = PIL.Image.open(io.BytesIO(contents)).convert("L")
    pil_image = PIL.ImageOps.invert(pil_image)
    pil_image = pil_image.resize((28, 28))
    image = np.array(pil_image).astype(np.float32)  # keep 0–255 scale
    image = image.reshape(1, -1)  # flatten to (1, 784)
    prediction = model.predict(image)
    return {"prediction": int(prediction[0])}


@app.get("/", response_class=HTMLResponse)
async def read_index():
    """Serve the frontend index.html located in the same package directory."""
    index_file = Path(__file__).parent / "index.html"
    if not index_file.exists():
        return HTMLResponse("<h1>Index not found</h1>", status_code=404)
    return HTMLResponse(index_file.read_text(encoding="utf-8"))


@app.get("/favicon.ico")
async def favicon():
    fav = Path(__file__).parent / "favicon.ico"
    if fav.exists():
        return FileResponse(str(fav))
    return JSONResponse(status_code=204, content={})

