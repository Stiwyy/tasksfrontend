import React, { useState } from "react";

export default function Login({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        tasks: ""
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        const payload = {
            username: formData.username,
            password: formData.password,
            tasks: formData.tasks
                ? formData.tasks.split(",").map(task => ({ description: task.trim() }))
                : []
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

            const contentType = response.headers.get("content-type");
            let data;

            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = { message: await response.text() };
            }

            if (!response.ok) {
                throw new Error(data.message || "Etwas ist schiefgelaufen.");
            }

            setSuccessMessage(data.message || "Erfolg!");

            if (!isRegistering) {
                onLogin(data.token);
            } else {
                setIsRegistering(false);
                setFormData({
                    username: "",
                    password: "",
                    tasks: ""
                });
            }
        } catch (error) {
            console.error("Fehler bei der Anfrage:", error);
            setErrorMessage(error.message || "Ein unerwarteter Fehler ist aufgetreten.");
        }
    };

    return (
        <div className="auth-form">
            <h2>{isRegistering ? "Registrieren" : "Anmelden"}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Benutzername:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
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
                        onChange={handleChange}
                        required
                    />
                </div>
                {isRegistering && (
                    <div>
                        <label htmlFor="tasks">Aufgaben (optional):</label>
                        <input
                            type="text"
                            id="tasks"
                            name="tasks"
                            value={formData.tasks}
                            onChange={handleChange}
                            placeholder="Aufgaben durch Komma getrennt"
                        />
                    </div>
                )}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}
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
