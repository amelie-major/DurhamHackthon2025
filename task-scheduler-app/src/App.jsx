//App.jsx
import React, { useState } from "react";
import "./App.css"; // Import your CSS file here

function App() {
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [task, setTask] = useState("");
    const [priority, setPriority] = useState("top");
    const [deadline, setDeadline] = useState("");

    const handleTaskChange = (e) => {
        setTask(e.target.value);
    };

    const handlePriorityChange = (e) => {
        setPriority(e.target.value);
    };

    const handleDeadlineChange = (e) => {
        setDeadline(e.target.value);
    };

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
        const updatedTasks = tasks.map((t) =>
            t.id === id ? { ...t, done: true } : t
        );
        setTasks(updatedTasks);

        const completedTask = tasks.find((t) => t.id === id);
        if (completedTask) {
            setCompletedTasks([...completedTasks, completedTask]);
        }
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
                    <select
                        id="Country"
                        value={priority}
                        onChange={handlePriorityChange}
                    >
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
                    <label htmlFor="deadline">Deadline</label>
                    <input
                        type="datetime-local"
                        id="deadline"
                        value={deadline}
                        onChange={handleDeadlineChange}
                    />
                    <input
                        type="date"
                        id="deadline"
                        value={deadline}
                        onChange={handleDeadlineChange}
                    />
                    <button id="add-task" onClick={addTask}>
                        Add Attendees
                    </button>
                </div>
                <h2 className="heading">Upcoming Tasks</h2>
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