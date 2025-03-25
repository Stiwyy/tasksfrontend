import React, { useState } from "react";

export default function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        tasks: [{ description: "", completed: false }]
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e, index) => {
        const { name, value, type, checked } = e.target;
        const updatedTasks = [...formData.tasks];

        if (name === "taskDescription") {
            updatedTasks[index].description = value;
        } else if (name === "taskCompleted") {
            updatedTasks[index].completed = checked;
        }

        setFormData({ ...formData, tasks: updatedTasks });
    };

    const addTask = () => {
        setFormData({
            ...formData,
            tasks: [...formData.tasks, { description: "", completed: false }]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const payload = {
            username: formData.username,
            password: formData.password,
            tasks: formData.tasks.map(task => ({
                description: task.description.trim(),
                completed: task.completed
            }))
        };

        try {
            const apiUrl = isRegistering
                ? "http://127.0.0.1:8080/api/users"
                : "http://127.0.0.1:8080/api/users/signIn";

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg || "Etwas ist schiefgelaufen.");
            }

            const data = await response.json();
            setSuccessMessage(data.message || "Erfolg!");

            if (!isRegistering) {
                onLogin({
                    token: data.token,
                    username: formData.username,
                    password: formData.password
                });
            } else {
                setIsRegistering(false);
                setFormData({
                    username: "",
                    password: "",
                    tasks: [{ description: "", completed: false }]
                });
            }
        } catch (error) {
            console.error("Fehler bei der Anfrage:", error);
            setErrorMessage(error.message || "Ein unerwarteter Fehler ist aufgetreten.");
        }
    };

    return (
        <div>
            <h2>{isRegistering ? "Registrieren" : "Anmelden"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Benutzername:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="password">Passwort:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>
                {isRegistering && (
                    <>
                        <div>
                            <label htmlFor="tasks">Aufgaben (optional):</label>
                            {formData.tasks.map((task, index) => (
                                <div key={index}>
                                    <input
                                        type="text"
                                        name="taskDescription"
                                        value={task.description}
                                        onChange={(e) => handleChange(e, index)}
                                        placeholder="Aufgabe"
                                    />
                                    <label>
                                        Erledigt:
                                        <input
                                            type="checkbox"
                                            name="taskCompleted"
                                            checked={task.completed}
                                            onChange={(e) => handleChange(e, index)}
                                        />
                                    </label>
                                </div>
                            ))}
                            <button type="button" onClick={addTask}>Weitere Aufgabe hinzufügen</button>
                        </div>
                    </>
                )}
                {errorMessage && <p>{errorMessage}</p>}
                {successMessage && <p>{successMessage}</p>}
                <button type="submit">{isRegistering ? "Registrieren" : "Anmelden"}</button>
            </form>
            <p>
                {isRegistering ? "Haben Sie bereits ein Konto?" : "Noch kein Konto?"}{" "}
                <button
                    onClick={() => {
                        setIsRegistering(!isRegistering);
                        setErrorMessage("");
                        setSuccessMessage("");
                    }}
                >
                    {isRegistering ? "Anmelden" : "Registrieren"}
                </button>
            </p>
        </div>
    );
}
