const jwt = require('jsonwebtoken');
require("dotenv").config();

const keySec = process.env.SECRET_KEY;

// Middleware d'authentification
function authMiddleware(req, res, next) {
  const token = req.cookies.access_token;

  if (!token) {
    // Si le token n'existe pas, redirigez l'utilisateur vers la page de connexion
    return res.redirect('/connexion');
  }

  try {
    // Vérifiez que le token est valide en utilisant la clé secrète
    const decodedToken = jwt.verify(token, keySec);

    // Ajoutez les informations de l'utilisateur décodé à l'objet de requête
    const userId = decodedToken.userId;
    
    // Ajoutez le ID de l'utilisateur à l'objet de requête
    req.user = { userId };

    // Passez au middleware suivant
    next();
  } catch (err) {
    // Si le token est invalide, redirigez l'utilisateur vers la page de connexion
    return res.redirect('/connexion');
  }
}

module.exports = authMiddleware;
