import './App.css';
import { useEffect, useState } from 'react';

function createAccount(username, password, callback) {
    fetch("http://localhost:9000/createAccount", { // use window.location.href in build?
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
                callback(username);
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
                callback(username);
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
                callback(null);
            }
        });
}

function checkLogin(callback) {
    fetch("http://localhost:9000/checkLogin", { credentials: "include" })
        .then(res => res.json())
        .then(res => {
            if (res.loggedIn !== "yes") {
                callback(null);
            } else {
                callback(res.username);
            }
        });
}

function post(text, callback) {
    if (text.length > 300) {
        alert("Post is too long! Limit the length to 300 characters");
        return;
    }
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
                <div key={idx} className="post">
                    <p>{post.time}</p>
                    <p>{post.user}</p>
                    <p>{post.text}</p>
                </div>    
            )
        )
        .then(res => callback(res));
}

function getPostsForUser(user, callback) {
    fetch("http://localhost:9000/posts", {
        method: 'POST',
        credentials: "include",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: user
        })
    })
        .then(res => res.json())
        .then(res => res.map((post, idx) => 
                <div key={idx} className="post">
                    <p>{post.time}</p>
                    <p>{post.user}</p>
                    <p>{post.text}</p>
                </div>    
            )
        )
        .then(res => callback(res));
}

function getUsers(callback) {
    fetch("http://localhost:9000/users", { credentials: "include" })
        .then(res => res.json())
        .then(res => callback(res));
}

function App() {
    const [enteringCredentials, setEnteringCredentials] = useState(false);
    const [makingPost, setMakingPost] = useState(false);
    const [loggedUser, setLoggedUser] = useState(null);
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [userFilter, setUserFilter] = useState("");
    const [postText, setPostText] = useState("");
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [displayedUsers, setDisplayedUsers] = useState([]);
    const [postsOfUser, setPostsOfUser] = useState(null);

    useEffect(() => {
        checkLogin(setLoggedUser);
        getPosts(setPosts);
        getUsers(setUsers);
    }, []);
    useEffect(() => {
        if (loggedUser) {
            setUsernameInput("");
            setPasswordInput("");
            setEnteringCredentials(false);
        } else {
            setMakingPost(false);
        }
    }, [loggedUser]);
    useEffect(() => {
        if (enteringCredentials || makingPost) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "visible";
        }
    }, [enteringCredentials, makingPost]);
    useEffect(() => {
        setDisplayedUsers(users.filter(user => {
                if (user.toLowerCase().includes(userFilter.toLowerCase())) return true;
                return false;
            })
            .map((user, idx) => 
                <div 
                    key={idx} 
                    onClick={() => {
                        if (postsOfUser === user) {
                            setPostsOfUser(null);
                        } else {
                            setPostsOfUser(user);
                        }
                    }}
                    className={(postsOfUser === user && "selected user") || "user"}
                >
                    <p>{user}</p>
                </div>    
            ));
    }, [users, userFilter, postsOfUser]);
    useEffect(() => {
        if (!postsOfUser) {
            getPosts(setPosts);
        } else {
            getPostsForUser(postsOfUser, setPosts);
        }
    }, [postsOfUser]);

    return (
        <div className="App">
            {enteringCredentials &&
            <div className="enterCredentials">
                <div>
                    <input value={usernameInput} onChange={e => setUsernameInput(e.target.value)}>
                    </input>
                    <input 
                        type="password"
                        value={passwordInput} 
                        onChange={e => setPasswordInput(e.target.value)}
                    >
                    </input>
                </div> 
                <button onClick={() => {
                    createAccount(usernameInput, passwordInput, setLoggedUser);
                }}>
                    Create Account
                </button> 
                <button onClick={() => {
                    login(usernameInput, passwordInput, setLoggedUser);
                }}>
                    Log In
                </button>
                <button onClick={() => setEnteringCredentials(false)}>
                    Cancel
                </button>
            </div>
            }
            {!loggedUser && !enteringCredentials && 
            <button onClick={() => setEnteringCredentials(true)}>
                Log in or create account
            </button>
            }
            {loggedUser &&
            <button onClick={() => logout(setLoggedUser)}>
                Log out
            </button>
            }
            {loggedUser &&
            <p>Logged in as {loggedUser}</p>
            }
            {loggedUser && !makingPost &&
            <button onClick={() => setMakingPost(true)}>
                Make new post
            </button>
            }
            {makingPost &&
            <div className="makePost">
                <textarea value={postText} onChange={e => setPostText(e.target.value)}>
                </textarea>
                <button onClick={() => {
                    post(postText, setPostText);
                    setMakingPost(false);
                }}>
                    Post
                </button>
                <button onClick={() => setMakingPost(false)}>
                    Cancel
                </button>
            </div>
            }
            <div className="centered">
                <p>Users</p>
                <input value={userFilter} onChange={e => setUserFilter(e.target.value)}>
                </input>
                <div className="centered">
                    {displayedUsers}
                </div>
            </div>
            <div className="centered">
                <p>
                    {(postsOfUser && "Posts of user " + postsOfUser) || "All posts"}
                </p>
                <div className="centered">
                    {posts}
                </div>
            </div>
        </div>
    );
}

export default App;
