import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function callApi(callback) {
    fetch("http://localhost:9000/apiTest") // window.location.href
        .then(res => res.text())
        .then(res => callback(res));
}

function createAccount(username, password, callback) {
    fetch("http://localhost:9000/createAccount", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(res => res.text())
        .then(res => {
            if (res === "invalid") {
                alert("Invalid information");
            } else if (res === "username taken") {
                alert("Username is already taken");
            } else if (res === "createAccount") {
                callback(true);
            }
        });
}

function login(username, password, callback) {
    fetch("http://localhost:9000/login", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(res => res.text())
        .then(res => {
            if (res !== "login") {
                alert("Login failed");
            } else {
                callback(true);
            }
        });
}

function logout(callback) {
    fetch("http://localhost:9000/logout")
        .then(res => res.text())
        .then(res => {
            if (res !== "logout") {
                alert("Something went wrong");
            } else {
                callback(false);
            }
        });
}

function App() {
    const [apiResponse, setApiResponse] = useState("No response from api");
    const [loggedIn, setLoggedIn] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");

    useEffect(() => {
        callApi(setApiResponse);
    }, []);
    useEffect(() => {
        if (loggedIn) {
            setUsernameInput("");
            setPasswordInput("");
        }
    }, [loggedIn]);

    return (
        <div className="App">
            {!loggedIn &&
            <div>
                <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)}>
                </input>
                <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)}>
                </input>
            </div>
            }
            {!loggedIn && 
            <button onClick={() => createAccount(usernameInput, passwordInput, setLoggedIn)}>
                Create Account
            </button>
            }
            {!loggedIn && 
            <button onClick={() => login(usernameInput, passwordInput, setLoggedIn)}>
                Log In
            </button>
            }
            {loggedIn &&
            <button onClick={() => logout(setLoggedIn)}>Log out</button>
            }
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Api responds with "{apiResponse}"!
                </p>
            </header>
        </div>
    );
}

export default App;
