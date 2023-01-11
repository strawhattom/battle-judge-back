const isAuthorized = (allowed = []) => (req, res, next) => {
	if (!allowed || allowed === []) return;
    if (!req.user || !req.user.role) return res.status(401).send(); // No user
    if (!allowedRoles.includes(req.user.role)) return res.status(403).send(); // No role
    next();
}

module.exports = isAuthorized;