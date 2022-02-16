const express = require("express");
const path = require("path");

const app = new express();
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0/perfect_day_db", {
    useNewUrlParser: true,
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const validateRegisterMiddleWare = require("./middleware/validateRegisterMiddleWare");
app.use("/auth/storeUser", validateRegisterMiddleWare);

app.listen(3000, () => {
    console.log("App listening on port 3000");
});

const homeController = require("./controllers/home");
app.get(["/", "/home"], homeController);

const aboutController = require("./controllers/about");
app.get("/about", aboutController);

const dataController = require("./controllers/data");
app.get("/api/data", dataController);

const registerController = require("./controllers/register");
app.get("/register", registerController);

const loginPageController = require("./controllers/login.js");
app.get("/login", loginPageController);

const storeUserController = require("./controllers/storeUser");
app.post("/auth/storeUser", storeUserController);

const loginUserController = require("./controllers/loginUser");
app.post("/auth/loginUser", loginUserController);
