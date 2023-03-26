module.exports = (request, result) => {
    var isIncorrect = request.query.incorrect_uname_password === "true";
    var isRegistered = request.query.registerSuccess === "true";
    result.render("login", {
        incorrectDetails: isIncorrect,
        registerSuccess: isRegistered,
    });
};
