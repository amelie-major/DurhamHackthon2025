import io
import pickle
from pathlib import Path
import json
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from pydantic import BaseModel
import datetime
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

# Pydantic models for request validation
class AvailabilityWindow(BaseModel):
    start: str
    end: str

class EventDuration(BaseModel):
    days: int = 0
    hours: int = 0

class PredictionRequest(BaseModel):
    attendees: dict[str, int]
    availability_window: AvailabilityWindow
    event_duration: EventDuration

@app.post("/predict-json/")
async def predict_json(data: PredictionRequest):
    """
    Receive JSON data in the following format:
    {
        "attendees": {"London": 2, "Paris": 3},
        "availability_window": {"start": "2025-10-06T09:00:00Z", "end": "2025-10-07T17:00:00Z"},
        "event_duration": {"days": 0, "hours": 2}
    }
    """

    try:
        # Extract values
        attendees = data.attendees
        availability_window = data.availability_window
        event_duration = data.event_duration

        # Parse availability window datetimes
        try:
            start_time = datetime.datetime.fromisoformat(availability_window.start.replace("Z", "+00:00"))
            end_time = datetime.datetime.fromisoformat(availability_window.end.replace("Z", "+00:00"))
        except ValueError:
            return JSONResponse(status_code=400, content={"error": "Invalid datetime format"})

        # Compute event duration as timedelta
        duration = datetime.timedelta(
            days=event_duration.days,
            hours=event_duration.hours
        )

        # This is a placeholder for more complex prediction logic
        num_total_attendees = sum(attendees.values())
        offices = list(attendees.keys())

        # Simple example: pick the first office as "predicted" meeting location
        predicted_office = offices[0] if offices else "Unknown"

        return {
            "status": "success",
            "num_total_attendees": num_total_attendees,
            "offices": offices,
            "availability_start": start_time.isoformat(),
            "availability_end": end_time.isoformat(),
            "event_duration_hours": duration.total_seconds() / 3600,
            "prediction": predicted_office
        }

    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={"error": str(e)}
        )


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