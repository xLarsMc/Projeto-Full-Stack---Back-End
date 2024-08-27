const jwt = require('jsonwebtoken');
const logFunction = require("../Helpers/logs")
const {body, validationResult} = require('express-validator');
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

  verifDados: [
    body('login').trim().notEmpty()
    .withMessage('Erro -> digite um login').escape(),
    body('senha').trim().notEmpty()
    .withMessage('Erro -> digite uma senha').escape(),
    (req, res, next) => {
      const errors = validationResult(req);
      if(!errors.isEmpty()) {
        logFunction.log("Erro em uma tentativa de login", errors.array())
        return res.status(422).json({errors: errors.array()})
      }
    next();
  },
]

}
