const jwt = require('jsonwebtoken');
require('dotenv').config();
module.exports = {
  veriftoken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ msg: 'Token nao inserido' });
    }
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ msg: 'Acesso negado' });
    }
    try {
      const secret = process.env.SECRET;
      jwt.verify(token, secret);

      next();
    } catch (error) {
      res.status(400).json({ msg: 'token invalido' });
    }
  },
  verifDados(req, res, next) {
    const { login, senha } = req.body;
    if (!login) {
      return res.status(422).json({ msg: 'erro -> digite um login' });
    }
    if (!senha) {
      return res.status(422).json({ msg: 'erro -> digite uma senha' });
    }
    next();
  },
};
