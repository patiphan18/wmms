const jwt = require('jsonwebtoken');

module.exports = class Auth {

    constructor() {
        this.tokenKey = process.env.TOKEN_KEY
    }

    refreshToken(token, res) {
        if (!token) return false;
        try {
            const decoded = jwt.verify(token, process.env.TOKEN_KEY);
            const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, process.env.TOKEN_KEY, { expiresIn: "12h" });
            res.cookie('token', newToken, { maxAge: 900000, httpOnly: true });
            const data = {
                id: decoded.id,
                role: decoded.role
            };
            return data;
        } catch (err) {
            // console.log(err)
            res.clearCookie('token');
            return false;
        }
    }
}