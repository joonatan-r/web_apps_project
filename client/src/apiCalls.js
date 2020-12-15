export function createAccount(username, password, callback) {
    fetch(window.location.href + "createAccount", {
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

export function login(username, password, callback) {
    fetch(window.location.href + "login", {
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

export function logout(callback) {
    fetch(window.location.href + "logout", { credentials: "include" })
        .then(res => res.text())
        .then(res => {
            if (res !== "logout") {
                alert("Something went wrong");
            } else {
                callback(null);
            }
        });
}

export function checkLogin(callback) {
    fetch(window.location.href + "checkLogin", { credentials: "include" })
        .then(res => res.json())
        .then(res => {
            if (res.loggedIn !== "yes") {
                callback(null);
            } else {
                callback(res.username);
            }
        });
}

export function post(text, callback) {
    if (text.length > 300) {
        alert("Post is too long! Limit the length to 300 characters");
        return;
    }
    fetch(window.location.href + "newPost", {
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

export function getPosts(callback) {
    fetch(window.location.href + "posts", { credentials: "include" })
        .then(res => res.json())
        .then(res => createPostElements(res))
        .then(res => callback(res));
}

export function getPostsForUser(user, callback) {
    fetch(window.location.href + "posts", {
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
        .then(res => createPostElements(res))
        .then(res => callback(res));
}

export function getUsers(callback) {
    fetch(window.location.href + "users", { credentials: "include" })
        .then(res => res.json())
        .then(res => callback(res));
}

function createPostElements(list) {
    const elems = list.map((post, idx) => 
        <div key={idx} className="post">
            <div className="post-info">
                <p>{post.user}</p>
                <p>{formatDate(post.time)}</p>
            </div>
            <div className="post-content">
                <p>{post.text}</p>
            </div>
        </div>    
    );

    if (!elems.length) {
        return [(
            <div key={0} className="post">
                <div className="post-content">
                    <p>No posts</p>
                </div>
            </div> 
        )];
    }
    return elems;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    return toPadString(hours) + ":" + toPadString(minutes) + "\n"
            + date.getDate() + "." + (date.getMonth()+1) + "."
            + date.getFullYear();
}

function toPadString(n) {
    if (n < 9) return "0" + n;
    return "" + n;
}
