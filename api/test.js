const mongoose = require("mongoose");
const DayStatus = require("./models/DayStatus");

mongoose.connect("mongodb://0.0.0.0/perfect_day_db", { useNewUrlParser: true });

DayStatus.create(
    {
        date: Date.parse("2020-02-09"),
        goal1: true,
        comment: "testing in test.js",
    },
    (error, daystatus) => {
        console.log(error, daystatus);
    }
);

DayStatus.findOneAndDelete(
    {
        comment: "testing in test.js",
    },
    (error, daystatus) => {
        console.log(error, daystatus);
    }
);
