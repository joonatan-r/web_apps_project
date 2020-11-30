var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.send(req.app.locals.text);
});

module.exports = router;
