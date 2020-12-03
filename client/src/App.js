import './App.css';
import { useEffect, useState } from 'react';
import { 
    createAccount, 
    login, 
    logout, 
    checkLogin, 
    post, 
    getPosts, 
    getPostsForUser, 
    getUsers 
} from './apiCalls';

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
        }
    }, [loggedUser]);
    useEffect(() => {
        if (enteringCredentials || makingPost) {
            document.body.style.overflowY = "hidden";
        } else {
            document.body.style.overflowY = "scroll";
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
            {loggedUser && !makingPost &&
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
                <button onClick={() => {
                    setMakingPost(false);
                    setPostText("");
                }}>
                    Cancel
                </button>
            </div>
            }
            <div className="main-container">
                <div className="user-container">
                    <p>Users</p>
                    <input value={userFilter} onChange={e => setUserFilter(e.target.value)}>
                    </input>
                    <div className="centered">
                        {displayedUsers}
                    </div>
                </div>
                <div className="post-container">
                    <div className="centered">
                        <p>
                            {(postsOfUser && "Posts of user " + postsOfUser) || "All posts"}
                        </p>
                        <div className="centered">
                            {posts}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
