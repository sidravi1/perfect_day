const DayStatus = require("../models/DayStatus");

module.exports = (request, result) => {
    DayStatus.find((err, docs) => {
        if (!err) {
            result.json(docs);
        } else {
            console.log("Failed to retrieve data");
        }
    });
};
