
const verifyAdmin = (req, res, next) => {
    console.log(req.user.user);
    if (req.user.user.role !== "admin") {
        return res.status(403).json({
            message: "Access denied, admin only"
        });
    }
    next();
}

module.exports = verifyAdmin;
