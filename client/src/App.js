import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function createAccount(username, password, callback) {
    fetch("http://localhost:9000/createAccount", { // window.location.href in build ?
        method: 'POST',
        credentials: "include",
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
        credentials: "include",
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
    fetch("http://localhost:9000/logout", { credentials: "include" })
        .then(res => res.text())
        .then(res => {
            if (res !== "logout") {
                alert("Something went wrong");
            } else {
                callback(false);
            }
        });
}

function post(text, callback) {
    fetch("http://localhost:9000/newPost", {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: text
        })
    })
        .then(res => res.text())
        .then(res => {
            if (res !== "newPost") {
                alert("Something went wrong");
            } else {
                callback("");
            }
        });
}

function getPosts(callback) {
    fetch("http://localhost:9000/posts", { credentials: "include" })
        .then(res => res.json())
        .then(res => res.map((post, idx) => 
                <div key={idx} style={{height: "100px", width: "100px", border: "1px solid black"}}>
                    <p>{post.user}</p>
                    <p>{post.text}</p>
                </div>    
            )
        )
        .then(res => callback(res));
}

function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (loggedIn) {
            setUsernameInput("");
            setPasswordInput("");
        }
    }, [loggedIn]);
    useEffect(() => {
        getPosts(setPosts);
    }, []);

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
            <button onClick={() => logout(setLoggedIn)}>
                Log out
            </button>
            }
            {loggedIn &&
            <div>
                <textarea value={postText} onChange={e => setPostText(e.target.value)}>
                </textarea>
                <button onClick={() => post(postText, setPostText)}>
                    Post
                </button>
            </div>
            }
            <div 
                style={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <p>Users</p>
            </div>
            <div 
                style={{ border: "1px solid black", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
                <p>Posts</p>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {posts}
                </div>
            </div>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>
        </div>
    );
}

export default App;
