const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'super_secret_key',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const users = [];
const posts = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});
app.post('/createAccount', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        res.send('invalid');
        return;
    }
    for (let user of users) {
        if (user.username === username) {
            res.send('username taken');
            return;
        }
    }
    users.push({ username: username, password: password });
    req.session.user = username;
    res.send('createAccount');
});
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    for (let user of users) {
        if (user.username === username && user.password === password) {
            req.session.user = username;
            res.send('login');
            return;
        }
    }
    res.send('invalid');
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('logout');
});
app.get('/checkLogin', (req, res) => {
    if (!req.session.user) {
        res.send({ loggedIn: 'no' });
    } else {
        res.send({ loggedIn: 'yes', username: req.session.user });
    }
});
app.post('/newPost', (req, res) => {
    if (!req.session.user || !req.body.text || req.body.text.length > 300) {
        res.send('invalid');
        return;
    }
    posts.unshift({ 
        user: req.session.user, 
        text: req.body.text, 
        time: new Date().toLocaleString() 
    });
    res.send('newPost');
});
app.get('/posts', (req, res) => {
    res.send(JSON.stringify(posts));
});
app.post('/posts', (req, res) => {
    const filteredPosts = [];

    if (!req.body.user) {
        res.send('invalid');
        return;
    }

    for (let post of posts) {
        if (post.user === req.body.user) {
            filteredPosts.push(post);
        }
    }
    res.send(JSON.stringify(filteredPosts));
});
app.get('/users', (req, res) => {
    const usernames = users.map(user => user.username);
    res.send(JSON.stringify(usernames));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
