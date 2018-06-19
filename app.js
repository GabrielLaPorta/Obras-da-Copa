const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

const config = require(path.join(__dirname + "/server/config"));
const comment = require(path.join(__dirname + "/server/api/route/comment"));

const app = express();

app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(config.rootClientPath, express.static(__dirname + "/app"));

app.use(cookieParser());
app.use(session({
    key: "user_sid",
    secret: "1234567890QWERTY",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 31557600
    }
}));
app.set("trust proxy", 1);
app.use(bodyParser.urlencoded({
    extended: false
}));

const user = require(path.join(__dirname + "/server/api/route/user"));

app.use(bodyParser.json());
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.user) {
        res.clearCookie("user_sid");
    }

    next();
});

// api routes
app.use(`${config.rootApiServerPath}/users`, user);
app.use(`${config.rootApiServerPath}/comments`, comment);

app.get(`${config.rootClientPath}/*`, (req, res, next) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/", (req, res, next) => {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.listen(config.port, () => console.log(`Server running on ${config.port}`));