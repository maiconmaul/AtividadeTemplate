const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function requireAuth(req, res, next) {
  const token = req.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return res.status(401).json({ message: 'Autenticação necessária.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub).select('_id name email');
    if (!user) return res.status(401).json({ message: 'Sessão inválida.' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
}

module.exports = requireAuth;
