const User = require("../models/User");
module.exports = (require, result) => {
    User.create(require.body, (error, user) => {
        if (error) {
            console.log(error);
        } else {
            result.redirect("/");
        }
    });
};
