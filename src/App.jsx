import "./App.css";
import Login from "./components/Login";
import { useState } from "react";

function App() {
    const [token, setToken] = useState("");

    const handleLogin = (token) => {
        setToken(token);
    };

    return (
        <div className="app">
            {!token ? (
                <Login onLogin={handleLogin} />
            ) : (
                <div className="token-page">
                    <h1>Token: {token}</h1>
                </div>
            )}
        </div>
    );
}

export default App;
