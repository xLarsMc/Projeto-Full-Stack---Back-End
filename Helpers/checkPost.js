module.exports = {
    verifPost(req, res, next) {
        const { name, commonPlaces, description, drops, image } = req.body;
        if (!name) {
          return res.status(401).json({ msg: 'Digite um nome!' });
        }
        if(!commonPlaces) {
            return res.status(401).json({msg: 'Digite os lugares comums!'})
        }
        if(!description) {
            return res.status(401).json({msg: 'Digite uma descrição!'})
        }
        if(!drops) {
            return res.status(401).json({msg: 'Digite os drops!'})
        }
        if(!image) {
            return res.status(401).json({msg: 'Digite o link de uma imagem!'})
        }
        next();
      },
}