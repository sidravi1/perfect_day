const User = require("../models/User");
module.exports = (request, result) => {
    // console.log(request.body);
    var data = {
        firstname: request.body.firstname,
        lastname: request.body.lastname,
        password: request.body.password,
        username: request.body.username,
    };

    User.create(data, (error, user) => {
        if (error) {
            console.log(data, error);
        } else {
            result.redirect("/");
        }
    });
};
