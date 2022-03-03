const User = require("../models/User");
const querystring = require("querystring");

module.exports = async (req, res, next) => {
    const username = req.body.username;
    let alerts = {};

    const count = await User.countDocuments({ username: username });
    const passwordMismatch = await passwordsAreMismatched(
        req.body.password,
        req.body.password_reenter
    );

    if (count > 0) alerts["username_in_use"] = true;
    if (passwordMismatch) alerts["password_mismatch"] = true;

    console.log(alerts);
    if (Object.keys(alerts).length > 0) {
        const query = querystring.stringify(alerts);
        res.redirect("/register?" + query);
    } else {
        next();
    }
};

const passwordsAreMismatched = (password1, password2) => {
    if (password1 != password2) {
        return true;
    } else {
        return false;
    }
};
