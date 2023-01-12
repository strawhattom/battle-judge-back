const isAuthorized = (allowed = []) => (req, res, next) => {
    if (!req.user?.role) return res.status(401).send(); // No user
    if (!allowed.includes(req.user.role)) return res.status(403).send(); // No role
    return next();
}

module.exports = isAuthorized;