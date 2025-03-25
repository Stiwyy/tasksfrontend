import "./App.css";
import Login from "./components/Login";
import { useState } from "react";

function App() {
    const [authData, setAuthData] = useState(null);
    const [resetUsername, setResetUsername] = useState("");
    const [resetPassword, setResetPassword] = useState("");
    const [resetError, setResetError] = useState("");

    const handleLogin = (data) => {
        setAuthData(data);
    };

    const handleResetToken = async () => {
        setResetError("");
        try {
            const response = await fetch("http://127.0.0.1:8080/api/users/signIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: resetUsername,
                    password: resetPassword,
                }),
            });
            if (!response.ok) {
                const errMsg = await response.text();
                throw new Error(errMsg);
            }
            const data = await response.json();
            setAuthData({ ...authData, token: data.token });
        } catch (error) {
            setResetError("Token Reset fehlgeschlagen: " + error.message);
        }
    };

    return (
        <div>
            {!authData ? (
                <Login onLogin={handleLogin} />
            ) : (
                <div>
                    <p>Token: {authData.token}</p>
                    <div>
                        <h2>Regenerate Token</h2>
                        <div>
                            <label htmlFor="resetUsername">Benutzername: </label>
                            <input
                                type="text"
                                id="resetUsername"
                                value={resetUsername}
                                onChange={(e) => setResetUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="resetPassword">Passwort: </label>
                            <input
                                type="password"
                                id="resetPassword"
                                value={resetPassword}
                                onChange={(e) => setResetPassword(e.target.value)}
                            />
                        </div>
                        <button onClick={handleResetToken}>Token neu anfordern</button>
                        {resetError && <p>{resetError}</p>}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
