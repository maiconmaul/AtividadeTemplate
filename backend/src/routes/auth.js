const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const requireAuth = require('../middleware/auth');

const router = express.Router();

function createSession(user) {
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ message: 'Informe nome, e-mail e senha com ao menos 6 caracteres.' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail })) return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email: normalizedEmail, passwordHash });
    return res.status(201).json(createSession(user));
  } catch (error) { return next(error); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user || !await bcrypt.compare(password || '', user.passwordHash)) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }
    return res.json(createSession(user));
  } catch (error) { return next(error); }
});

router.get('/me', requireAuth, (req, res) => res.json({ user: req.user }));

module.exports = router;
