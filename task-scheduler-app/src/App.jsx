import React, { useState } from "react";
import "./App.css";
import logo from "./assets/earth.png";

function App() {
  const [attendees, setAttendees] = useState([]);
  const [office, setOffice] = useState("London");
  const [numAttendees, setNumAttendees] = useState("");
  const [availabilityStart, setAvailabilityStart] = useState("");
  const [availabilityEnd, setAvailabilityEnd] = useState("");
  const [eventDays, setEventDays] = useState(0);
  const [eventHours, setEventHours] = useState(2);
  const [comment, setComment] = useState("");
  const [outputJson, setOutputJson] = useState(null);

  // Input handlers
  const handleNumChange = (e) => setNumAttendees(e.target.value);
  const handleOfficeChange = (e) => setOffice(e.target.value);
  const handleAvailabilityStartChange = (e) => setAvailabilityStart(e.target.value);
  const handleAvailabilityEndChange = (e) => setAvailabilityEnd(e.target.value);
  const handleDaysChange = (e) => setEventDays(e.target.value);
  const handleHoursChange = (e) => setEventHours(e.target.value);
  const handleCommentChange = (e) => setComment(e.target.value);

  // Add attendee
  const addAttendee = () => {
    if (numAttendees.trim() === "" || isNaN(numAttendees) || parseInt(numAttendees) <= 0) {
      alert("Please enter a valid number of attendees.");
      return;
    }

    const newAttendee = {
      id: Date.now(),
      office,
      numAttendees: parseInt(numAttendees),
    };

    setAttendees([...attendees, newAttendee]);
    setNumAttendees("");
    setOffice("London");
  };

  // Delete attendee
  const deleteAttendee = (id) => {
    const updatedList = attendees.filter((a) => a.id !== id);
    setAttendees(updatedList);
  };

  // Submit JSON
  const submitJson = () => {
    if (!availabilityStart || !availabilityEnd) {
      alert("Please set both start and end of the availability window.");
      return;
    }

    // Convert attendee list to { office: number } format
    const attendeeMap = attendees.reduce((acc, curr) => {
      acc[curr.office] = (acc[curr.office] || 0) + curr.numAttendees;
      return acc;
    }, {});

    const jsonOutput = {
      _comment: comment || "Optional comment",
      attendees: attendeeMap,
      availability_window: {
        start: new Date(availabilityStart).toISOString(),
        end: new Date(availabilityEnd).toISOString(),
      },
      event_duration: {
        days: parseInt(eventDays) || 0,
        hours: parseInt(eventHours) || 0,
      },
    };

    setOutputJson(jsonOutput);
    console.log("Generated JSON:", jsonOutput);
  };

  return (
    <div className="App">
      <header>
        <h1>Meeting in the Middle</h1>
      </header>

      <main>
        <div className="instructions">
          <h2>Instructions</h2>
          <ol>
            <li>Add attendees by selecting an office and specifying the number of attendees.</li>
            <li>Set the availability window for the meeting.</li>
            <li>Specify event duration and optional comment.</li>
            <li>Submit to generate the JSON request.</li>
          </ol>
        </div>

        {/* === Add Attendee Section === */}
        <div className="attendees-form">
          <input
            type="number"
            id="numAttendees"
            placeholder="Number of attendees..."
            value={numAttendees}
            onChange={handleNumChange}
            min="1"
          />
          <select id="office" value={office} onChange={handleOfficeChange}>
            <option value="London">London</option>
            <option value="Paris">Paris</option>
            <option value="Singapore">Singapore</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Dubai">Dubai</option>
            <option value="Shanghai">Shanghai</option>
            <option value="Zurich">Zurich</option>
            <option value="Geneva">Geneva</option>
            <option value="Aarhus">Aarhus</option>
            <option value="Sydney">Sydney</option>
            <option value="Budapest">Budapest</option>
            <option value="Wroclaw">Wroclaw</option>
          </select>
          <button id="add-attendees" onClick={addAttendee}>
            Add Attendees
          </button>
        </div>

        {/* === Availability Window === */}
        <div className="availability-window-selection">
          <h2 className="availability-heading">Availability Window</h2>

          <label htmlFor="availability-start">Starting: </label>
          <input
            type="datetime-local"
            id="availability-start"
            value={availabilityStart}
            onChange={handleAvailabilityStartChange}
          />

          <label htmlFor="availability-end">Ending: </label>
          <input
            type="datetime-local"
            id="availability-end"
            value={availabilityEnd}
            onChange={handleAvailabilityEndChange}
          />
        </div>

        {/* === Event Duration === */}
        <div className="duration-section">
          <h2>Event Duration</h2>
          <label>Days: </label>
          <input type="number" min="0" value={eventDays} onChange={handleDaysChange} />
          <label>Hours: </label>
          <input type="number" min="0" value={eventHours} onChange={handleHoursChange} />
        </div>

        {/* === Optional Comment === */}
        <div className="comment-section">
          <h2>Comment</h2>
          <input
            type="text"
            placeholder="Optional comment..."
            value={comment}
            onChange={handleCommentChange}
          />
        </div>

        {/* === Attendees Table === */}
        <h2 className="heading">Attendees</h2>
        <div className="attendees-list">
          {attendees.length === 0 ? (
            <p>No attendees added yet.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Office</th>
                  <th>Number of Attendees</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map((a) => (
                  <tr key={a.id}>
                    <td>{a.office}</td>
                    <td>{a.numAttendees}</td>
                    <td>
                      <button className="delete-btn" onClick={() => deleteAttendee(a.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <button className="submit-btn" onClick={submitJson}>
          Generate JSON
        </button>

        {/* === JSON Output === */}
        {outputJson && (
          <div className="json-output">
            <h2>Generated JSON</h2>
            <pre>{JSON.stringify(outputJson, null, 2)}</pre>
          </div>
        )}

        <div>
          <img src={logo} className="spin" alt="Spinning logo" width="500" />
        </div>
      </main>
    </div>
  );
}

export default App;
