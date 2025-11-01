import React, { useState } from "react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("top");
    const [deadline, setDeadline] = useState("");
    const [availabilityStart, setAvailabilityStart] = useState("");
    const [availabilityEnd, setAvailabilityEnd] = useState("");

    const handleTaskChange = (e) => setTask(e.target.value);
    const handlePriorityChange = (e) => setPriority(e.target.value);
    const handleDeadlineChange = (e) => setDeadline(e.target.value);
    const handleAvailabilityStartChange = (e) => setAvailabilityStart(e.target.value);
    const handleAvailabilityEndChange = (e) => setAvailabilityEnd(e.target.value);

    const addTask = () => {
        if (task.trim() === "" || deadline === "") {
            alert("Please enter a task and select a valid deadline.");
            return;
        }

        const selectedDate = new Date(deadline);
        const currentDate = new Date();

        if (selectedDate <= currentDate) {
            alert("Please select a future date for the deadline.");
            return;
        }

        const newTask = {
            id: tasks.length + 1,
            task,
            priority,
            deadline,
            done: false,
        };

        setTasks([...tasks, newTask]);
        setTask("");
        setPriority("top");
        setDeadline("");
    };

    const markDone = (id) => {
        setTasks((prevTasks) => {
            const updatedTasks = prevTasks.map((t) =>
                t.id === id ? { ...t, done: true } : t
            );
            const completedTask = updatedTasks.find((t) => t.id === id);
            setCompletedTasks((prev) => [...prev, completedTask]);
            return updatedTasks;
        });
    };

    const upcomingTasks = tasks.filter((t) => !t.done);

    return (
        <div className="App">
            <header>
                <h1>Meeting in the Middle</h1>
            </header>

            <main>
                <div className="attendees-form">
                    <input
                        type="text"
                        id="task"
                        placeholder="No. of attendees..."
                        value={task}
                        onChange={handleTaskChange}
                    />
                    <select id="Country" value={priority} onChange={handlePriorityChange}>
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
                    <button id="add-attendees" onClick={addTask}>
                        Add Attendees
                    </button>
                </div>

                <div className="availability-window-selection">
                  <thead>
                    <h2 className="availability-heading">Availability Window</h2>
      
                    <label htmlFor="availability-start">Starting </label>
                    <input
                        type="datetime-local"
                        id="availability-start"
                        value={availabilityStart}
                        onChange={handleAvailabilityStartChange}
                    />
                    <label htmlFor="availability-end">Ending </label>
                    <input
                        type="datetime-local"
                        id="availability-end"
                        value={availabilityEnd}
                        onChange={handleAvailabilityEndChange}
                    />
                    </thead>
                </div>

                <h2 className="heading">Attendees</h2>
                <div className="task-list" id="task-list">
                    <table>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {upcomingTasks.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.task}</td>
                                    <td>{t.priority}</td>
                                    <td>{t.deadline}</td>
                                    <td>
                                        {!t.done && (
                                            <button
                                                className="mark-done"
                                                onClick={() => markDone(t.id)}
                                            >
                                                Mark Done
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="completed-task-list">
                    <h2 className="cheading">Completed Tasks</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Task Name</th>
                                <th>Priority</th>
                                <th>Deadline</th>
                            </tr>
                        </thead>
                        <tbody>
                            {completedTasks.map((ct) => (
                                <tr key={ct.id}>
                                    <td>{ct.task}</td>
                                    <td>{ct.priority}</td>
                                    <td>{ct.deadline}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}

export default App;
