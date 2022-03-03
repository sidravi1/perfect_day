const express = require("express");
const path = require("path");

const app = new express();
const ejs = require("ejs");
const mongoose = require("mongoose");
const expressSession = require("express-session");
const flash = require("connect-flash");

mongoose.connect("mongodb://0.0.0.0/perfect_day_db", {
    useNewUrlParser: true,
});

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(
    expressSession({
        secret: "perfect42key",
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());

const validateRegisterMiddleWare = require("./middleware/validateRegisterMiddleWare");
app.use("/auth/storeUser", validateRegisterMiddleWare);
const authMiddleware = require("./middleware/authMiddleware");
const redirectIfAuthenticatedMiddleware = require("./middleware/redirectIfAuthenticatedMiddleware");

app.listen(3000, () => {
    console.log("App listening on port 3000");
});

global.loggedIn = null;
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next();
});
// endpoints
const homeController = require("./controllers/home");
app.get(["/", "/home"], authMiddleware, homeController);

const aboutController = require("./controllers/about");
app.get("/about", aboutController);

const dataController = require("./controllers/data");
app.get("/api/data", dataController);

const registerController = require("./controllers/register");
app.get("/register", redirectIfAuthenticatedMiddleware, registerController);

const loginPageController = require("./controllers/login.js");
app.get("/login", redirectIfAuthenticatedMiddleware, loginPageController);

const storeUserController = require("./controllers/storeUser");
app.post(
    "/auth/storeUser",
    redirectIfAuthenticatedMiddleware,
    storeUserController
);

const loginUserController = require("./controllers/loginUser");
app.post(
    "/auth/loginUser",
    redirectIfAuthenticatedMiddleware,
    loginUserController
);

const logoutController = require("./controllers/logout");
app.get("/logout", logoutController);

app.use((req, res) => res.render("notfound"));
