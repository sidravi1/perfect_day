const User = require("../models/User");
module.exports = (request, result) => {
    var data = {
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        password: request.body.password,
        username: request.body.username,
    };

    User.create(data, (error, user) => {
        if (error) {
            console.log(error.errors);
            const validationErrors = Object.fromEntries(
                Object.entries(error.errors).map(([k, v]) => [k, v.message])
            );
            console.log(validationErrors);
            request.flash("validationErrors", validationErrors);
            return result.redirect("/register");
        } else {
            result.redirect("/login?registerSuccess=true");
        }
    });
};
