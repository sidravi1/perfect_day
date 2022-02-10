const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DayStatusSchema = new Schema({
    date: {
        type: Date,
        default: new Date(),
    },
    goal1: {
        type: Boolean,
        default: false,
    },
    goal2: {
        type: Boolean,
        default: false,
    },
    goal3: {
        type: Boolean,
        default: false,
    },
    goal4: {
        type: Boolean,
        default: false,
    },
    comment: String,
});

const DayStatus = mongoose.model("DayStatus", DayStatusSchema);
module.exports = DayStatus;
