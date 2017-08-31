// validator for Login Form
exports.login = function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        res.status(400).end("Please Enter a Valid Email and Password...");
    } else {
        next();
    }
}

//Validator For Signup form
exports.signup = function (req, res, next) {
    console.log("This is signup validation...");
    if (!req.body.name || !req.body.email || !req.body.mobileNumber || !req.body.password) {
        res.status(400).end("please Enter all the Signup Credentials...");
    } else {
        console.log("this is validation of Signup...");
        next();
    }
}
