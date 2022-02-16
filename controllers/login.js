module.exports = (request, result) => {
    var isIncorrect = request.query.incorrect_uname_password === "true";
    result.render("login", {
        incorrectDetails: isIncorrect,
    });
};
