const LoginModel = require('../models/loginModel');
const Auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const sha256 = require('sha256');
const nodemailer = require('nodemailer');
process.env.TZ = 'Asia/Bangkok';

const registerView = async (req, res) => {
    var decoded = await new Auth().refreshToken(req.cookies['token'], res);
    if (decoded) return res.redirect('/');

    return res.render("./login/register", { role: 0 });
}

const loginView = async (req, res) => {
    var decoded = await new Auth().refreshToken(req.cookies['token'], res);
    if (decoded) return res.redirect('/');

    return res.render("./login/login", { role: 0 });
}

const forgetPasswordView = async (req, res) => {
    var decoded = await new Auth().refreshToken(req.cookies['token'], res);
    if (decoded) return res.redirect('/');

    return res.render("./login/forgotPassword", { role: 0 });
}

const resetPasswordView = async (req, res) => {
    var resetCode = req.params.code;
    var decoded = await new Auth().refreshToken(req.cookies['token'], res);
    if (decoded || !resetCode) return res.redirect('/');

    const objLoginModel = new LoginModel();
    var data = await objLoginModel.getResetCode(resetCode);

    if (data == null) return res.redirect('/');

    return res.render("./login/resetPassword", { role: 0, resetCode: resetCode });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(200).json({ status: 0, msg: "Email and password are required" });
    }

    const objLoginModel = new LoginModel();
    var data = await objLoginModel.getLogin(email, sha256(password));
    if (data != null) {
        const token = jwt.sign({ id: data.id, role: data.role }, process.env.TOKEN_KEY, { expiresIn: "12h" });
        res.cookie('token', token, { maxAge: 900000, httpOnly: true });
        return res.status(200).json({ status: 1 });
    } else {
        return res.status(200).json({ status: 0, msg: "Email or password is incorrect" });
    }
}

const register = async (req, res) => {
    const { email, password, fname, lname } = req.body;
    var emailFormat = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    if (!email || !password || !fname || !lname) return res.status(200).json({ status: 0, msg: "Input required" });

    if (!email.match(emailFormat)) return res.status(200).json({ status: 0, msg: "Wrong email format" });

    if (password.length < 6) return res.status(200).json({ status: 0, msg: "Password must be at least 6 characters" });


    const objLoginModel = new LoginModel();
    var emailCheck = await objLoginModel.getUserByEmail(email);
    if (emailCheck) return res.status(200).json({ status: 0, msg: "Email is already used" });

    var result = await objLoginModel.addUser(email, sha256(password), fname, lname, 2);
    if (result == 1) {
        var data = await objLoginModel.getLogin(email, sha256(password));
        const token = jwt.sign({ id: data.id, role: data.role }, process.env.TOKEN_KEY, { expiresIn: "12h" });
        res.cookie('token', token, { maxAge: 900000, httpOnly: true });
        return res.status(200).json({ status: 1 });
    } else {
        return res.status(200).json({ status: 0, msg: result });
    }
}

const resetPassword = async (req, res) => {
    const { code, password } = req.body;

    if (!code || !password) {
        return res.status(200).json({ status: 0, msg: "Password are required" });
    }

    if (password.length < 6) {
        return res.status(200).json({ status: 0, msg: "Password must be at least 6 characters" });
    }

    const objLoginModel = new LoginModel();
    var data = await objLoginModel.getResetCode(code);
    if (data == null) return res.status(200).json({ status: 0, msg: "Link incorrect or expired" });

    var result = await objLoginModel.updateResetPassword(sha256(password), code);
    if (result == 1) {
        return res.status(200).json({ status: 1 });
    } else {
        return res.status(200).json({ status: 0, msg: "Error" });
    }
}

const sendMail = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(200).json({ status: 0, msg: "Email is required" });
    }

    const objLoginModel = new LoginModel();
    var data = await objLoginModel.getUserByEmail(email);
    if (data == null) return res.status(200).json({ status: 0, msg: "Email not found" });
    var randomCode = Math.random().toString().slice(2, 8);

    const currentDate = new Date();
    // Add 10 minutes to the current date
    currentDate.setMinutes(currentDate.getMinutes() + 10);

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const codeExpire = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    var hashCode = sha256(randomCode + data.id);
    var result = await objLoginModel.updateResetCode(email, hashCode, codeExpire);

    if (result != 1) return res.status(200).json({ status: 0, msg: result });

    // Create a transporter using SMTP for Gmail
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.WMMS_MAIL,
            pass: process.env.WMMS_PASSWORD,
        },
    });
    var link = req.protocol + "://" + req.headers.host;
    if (link == 'http://prepro.informatics.buu.ac.th') link += "/wastemapbuu";
    link += "/resetPassword/" + hashCode;
    // Set up email data
    const mailOptions = {
        from: process.env.WMMS_MAIL,
        to: email,
        subject: 'Reset password link from Waste Map Management System',
        text: 'This is a reset password link ' + link + '\nLink will expire in ' + codeExpire + ' (Timezone: Asia/Bangkok)',
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(200).json({ status: 0, msg: error });
        }
        return res.status(200).json({ status: 1 });
    });


}


const logout = (req, res) => {
    res.clearCookie('token');
    return res.redirect('/');
}

module.exports = {
    registerView,
    loginView,
    forgetPasswordView,
    resetPasswordView,
    resetPassword,
    login,
    register,
    logout,
    sendMail
};