/**
 * Regarde si l'utilisateur à le rôle nécessaire pour accéder à la ressource
 * le rôle est récupéré dans la requête (défini par le middleware passport)
 * @param {string[]} allowed, liste des rôles autorisés à accéder à la ressource (par défaut, aucun)
 * @returns {function} middleware, passe au prochain middleware, sinon renvoie une erreur 401 ou 403
 */
const isAuthorized =
  (allowed = []) =>
  (req, res, next) => {
    if (!req.user?.role) return res.status(401).send(); // Pas d'utilisateur
    if (!allowed.includes(req.user.role)) return res.status(403).send(); // Pas le bon rôle
    return next();
  };

module.exports = isAuthorized;
