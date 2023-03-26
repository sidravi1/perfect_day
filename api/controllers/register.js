module.exports = (request, result) => {
    var isDuplicate = request.query.username_in_use === "true";
    var isPwMismatch = request.query.password_mismatch === "true";
    var validationErrors = request.flash("validationErrors")[0];

    errorDetails = {
        usernameInUse: isDuplicate,
        passwordMismatch: isPwMismatch,
    };

    if (validationErrors)
        validationErrors = Object.assign({}, errorDetails, validationErrors);
    else validationErrors = errorDetails;

    console.log("in register: ", validationErrors);
    result.render("register", {
        usernameInUse: isDuplicate,
        passwordMismatch: isPwMismatch,
    });
};
