
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
    const token = req.cookies?.jwtToken; // read token from cookie
    if (!token) {
        return res.status(401).json({
            message: "No token provided"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWTSECRETKEY);
        console.log(decoded);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = verifyToken;
