const helpers = require('./bdHelpers')
const logFunction = require("../Helpers/logs")

module.exports = {
    verifPost (req, res, next) {
        const { name, commonPlaces, description, drops, image } = req.body;
        if (!name) {
            logFunction.log(`Erro ao adicionar post. Nome não digitado.`)
          return res.status(401).json({ msg: 'Digite um nome!' });
        }
        if(!commonPlaces) {
            logFunction.log(`Erro ao adicionar post. Lugares Comuns não digitado.`)
            return res.status(401).json({msg: 'Digite os lugares comums!'})
        }
        if(!description) {
            logFunction.log(`Erro ao adicionar post. Descrição não digitada.`)
            return res.status(401).json({msg: 'Digite uma descrição!'})
        }
        if(!drops) {
            logFunction.log(`Erro ao adicionar post. Drops não digitado.`)
            return res.status(401).json({msg: 'Digite os drops!'})
        }
        if(!image) {
            logFunction.log(`Erro ao adicionar post. Link para a imagem não digitada.`)
            return res.status(401).json({msg: 'Digite o link de uma imagem!'})
        }
        next();
      },
}