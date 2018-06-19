const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const jsonParser = bodyParser.json();
const router = express.Router();

const commentService = require(path.join(__dirname, "../../service", "/comment"));

router.get("/", async (req, res, next) => {
    if (req.session.user) {
        const response = await commentService.getAll(req.session.user._id);

        res.send(response);
    } else {
        const response = await commentService.getAll();

        res.send(response);
    }
});

router.post("/", jsonParser, async (req, res, next) => {
    if (req.session.user) {
        await commentService.save(req.session.user._id, req.body.comment, req.session.user.username);

        res.send({
            message: "Comentário salvo!"
        });
    } else {
        res.send({
            message: "User"
        });
    }
});

router.put("/", jsonParser, async (req, res, next) => {
    if (req.session.user) {
        await commentService.update(req.body._id, req.body.comment);

        res.send({
            message: "Comentário salvo!"
        });
    } else {
        res.send({
            message: "User"
        });
    }
});

router.delete("/", jsonParser, async (req, res, next) => {
    await commentService.delete(req.session.user._id, req.query._id);

    res.send({
        message: "Comentario deletado!"
    });
});

module.exports = router;