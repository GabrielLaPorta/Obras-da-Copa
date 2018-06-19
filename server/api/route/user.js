const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
const router = express.Router();

const userService = require(path.join(__dirname, "../../service", "/user"));

router.get("/signup", async (req, res, next) => {
    if (req.session.user) {

        res.send(`Olá ${req.session.user.username}`);
    } else {
        res.send(null);
    }
});

router.get("/login", async (req, res, next) => {
    const user = await userService.authenticate(req.query.username, req.query.password);

    if (user) {
        await userService.createUserSession(req.session, user);
    }

    res.send({
        user: req.session.user
    });
});

router.get("/profile", async (req, res, next) => {
    if (req.session.user) {
        res.send({
            user: req.session.user.username
        });
    } else {
        res.send(null);
    }
});

router.post("/signup", jsonParser, async (req, res, next) => {
    if (await userService.userExist(req.body.username)) {
        const user = await userService.save(req.body.username, req.body.password);

        if (user) {
            await userService.createUserSession(req.session, user);
        }
    }

    res.send({
        user: req.session.user
    });
});

router.put("/logout", jsonParser, async (req, res, next) => {
    if (req.session) {
        await userService.logOut(req.session);

        res.clearCookie("user_sid", {
            path: "/"
        });
        res.send({
            message: "Session destroyed"
        });
    } else {
        res.send({
            message: "User is not log in"
        });
    }
});

module.exports = router;