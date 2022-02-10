const express = require("express");
const path = require("path");

const app = new express();
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://0.0.0.0/perfect_day_db", {
    useNewUrlParser: true,
});

const DayStatus = require("./models/DayStatus");

app.set("view engine", "ejs");
app.use(express.static("public"));

app.listen(3000, () => {
    console.log("App listening on port 3000");
});

app.get(["/", "/home"], (require, result) => {
    result.render("index");
});

app.get("/about", (require, result) => {
    result.render("about");
});

app.get("/api/data", (require, result) => {
    DayStatus.find((err, docs) => {
        if (!err) {
            result.json(docs);
        } else {
            console.log("Failed to retrieve data");
        }
    });
});
