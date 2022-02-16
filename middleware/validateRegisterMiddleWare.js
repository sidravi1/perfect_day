const User = require("../models/User");
const querystring = require("querystring");

module.exports = (req, res, next) => {
    const username = req.body.username;
    let alerts = {};

    User.countDocuments({ username: username }, (err, count) => {
        if (count > 0) {
            alerts["username_in_use"] = true;
        }
        if (req.body.password != req.body.password_reenter) {
            alerts["password_mismatch"] = true;
        }
        console.log(alerts);
        if (Object.keys(alerts).length > 0) {
            const query = querystring.stringify(alerts);
            // console.log(alerts);
            res.redirect("/register?" + query);
        } else {
            next();
        }
    });
};
