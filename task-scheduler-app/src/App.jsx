import React, { useState } from "react";
import "./App.css";

function App() {
    const [attendees, setAttendees] = useState([]);
    const [office, setOffice] = useState("London");
    const [numAttendees, setNumAttendees] = useState("");
    const [availabilityStart, setAvailabilityStart] = useState("");
    const [availabilityEnd, setAvailabilityEnd] = useState("");

    // Input handlers
    const handleNumChange = (e) => setNumAttendees(e.target.value);
    const handleOfficeChange = (e) => setOffice(e.target.value);
    const handleAvailabilityStartChange = (e) => setAvailabilityStart(e.target.value);
    const handleAvailabilityEndChange = (e) => setAvailabilityEnd(e.target.value);

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

    return (
        <div className="App">
            <header>
                <h1>Meeting in the Middle</h1>
            </header>

            <main>
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
                                            <button
                                                className="delete-btn"
                                                onClick={() => deleteAttendee(a.id)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </main>
        </div>
    );
}

export default App;
