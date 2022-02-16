module.exports = (request, result) => {
    var isDuplicate = request.query.username_in_use === "true";
    var isPwMismatch = request.query.password_mismatch === "true";
    result.render("register", {
        usernameInUse: isDuplicate,
        passwordMismatch: isPwMismatch,
    });
};
