
module.exports = function (req, res, next) {
    
    if (!req.user.admin) return res.status(401).json('Unauthorized')

    next();

};