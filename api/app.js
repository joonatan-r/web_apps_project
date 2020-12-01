const createError = require('http-errors');
const express = require('express');
const cors = require("cors");
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const indexRouter = require('./routes/index');
const apiRouter = require('./routes/apiTest');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'super_secret_key'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.locals.text = 'This is sent from api';

const users = [];

app.use('/', indexRouter);
app.use('/apiTest', apiRouter);

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'build', 'index.html'));
// });
app.get('/setText', (req, res) => {
    app.locals.text = 'Api text changed!';
    res.send('Succesfully changed text');
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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
