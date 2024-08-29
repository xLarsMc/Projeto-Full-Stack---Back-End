//Importações
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const helpers = require('../Helpers/bdHelpers');
const redis = require('redis')
const logFunction = require('../Helpers/logs')
const jwt = require('jsonwebtoken');
const auth = require('../Helpers/auth');
const checkPost = require('../Helpers/checkPost');
const { parse } = require('dotenv');
const SECRET = process.env.SECRET;
const limit = require('../Helpers/limiter')

const cliente = redis.createClient();
cliente.on('error', (err) => console.log("Redis deu erro!", err))

cliente.connect();

//Middleware implementado em todas as rotas, contra ataques automatizados
router.use((req, res, next) => {
  limit.limiter(req, res, next);
})

//Rota testes e instalação/deleção
router.get('/teste', (req, res) => {
  res.status(200).json({ msg: 'working' });
});

router.post('/teste', auth.veriftoken, async (req, res) => {
  const auth = await helpers.getLoginByAuthHeader(req.headers['authorization']);
  res.status(200).json({ msg: 'teste token valido', login: auth });
});

router.get('/install', async (req, res) => {
  try {
    await bcrypt.genSalt(15, async function (err, salt) {
      await bcrypt.hash('TesteLeandro', salt, async function (err, hash) {
        await helpers.newUser('Leandro', hash);
      });
    });
    await bcrypt.genSalt(15, async function (err, salt) {
      await bcrypt.hash('TesteKodi', salt, async function (err, hash) {
        await helpers.newUser('Kodi', hash);
      });
    });
    await bcrypt.genSalt(15, async function (err, salt) {
      await bcrypt.hash('TesteProfessor', salt, async function (err, hash) {
        await helpers.newUser('Professor', hash);
      });
    });
    const newPost1 = await helpers.newPost(
      'Teste1',
      'Teste1',
      'Teste1',
      'Teste1',
      '//botw-compendium.herokuapp.com/api/v3/compendium/entry/mountain_goat/image'
    );
    const newPost2 = await helpers.newPost(
      'Teste2',
      'Teste2',
      'Teste2',
      'Teste2',
      '//botw-compendium.herokuapp.com/api/v3/compendium/entry/mountain_goat/image'
    );
    const newPost3 = await helpers.newPost(
      'Teste3',
      'Teste3',
      'Teste3',
      'Teste3',
      '//botw-compendium.herokuapp.com/api/v3/compendium/entry/mountain_goat/image'
    );
    return res.status(200).json({
      msg: 'Usuários criados e Posts criados',
    });
  } catch (err) {
    return res.status(400).json({ msg: 'Deu ruim pai', err: err });
  }
});

router.delete('/install', async (req, res) => {
  const deleteds = await helpers.deleteAll();
  res.status(200).json({ msg: 'deletados', deleteds: deleteds });
});

//Rota Posts
router.post('/post', auth.veriftoken, checkPost.verifPost, async (req, res) => {
  const { name, commonPlaces, description, drops, image } = req.body;
  const existPost = await helpers.getPost(name);

  await cliente.del("postagens");

  if (existPost !== null) {
    logFunction.log(`Tentativa falha de adicionar postagem. Post com título ${name} já existe.`)
    return res.status(200).json({ msg: 'Um post com esse nome já existe!', existPost: existPost });
  }
  
  try {
    const newPost = await helpers.newPost(
      name,
      commonPlaces,
      description,
      drops,
      image
    );
    console.log(newPost);
    return res.status(200).json({ msg: 'Worked: ', post: newPost });
  } catch (err) {
    logFunction.log(`Erro desconhecido ao adicionar postagem: ${err}`)
    console.log(error);
    return res.status(500).json({ msg: 'Deu um erro!' + error });
  }
});

router.get('/post/:name', auth.veriftoken, async (req, res) => {
  const { name } = req.params;
  try {
    const postCache = await cliente.get(`post:${name}`)
    if(postCache){
      return res.status(200).json({existPost: JSON.parse(postCache)})
    }

    const existPost = await helpers.getPost(name);
    if (existPost !== null) {
      await cliente.set(`post:${name}`, JSON.stringify(existPost), {EX: 600});
      return res.status(200).json({ msg: 'Worked', existPost: existPost });
    } else {
      logFunction.log(`Tentativa falha de busca de postagem. Post com título ${name} não existe.`)
      return res
        .status(422)
        .json({ msg: 'Não há um post com esse nome!', existPost: existPost });
    }
  } catch (err) {
    logFunction.log(`Erro desconhecido ao buscar postagem: ${err}`)
    return res
      .status(400)
      .json({ msg: 'Um erro não identificado ocorreu', err: err });
  }
});

////////////////
router.post('/logged', auth.veriftoken, async (req, res) => {
  return res.status(200).json({ msg: 'Logado!' });
});

router.post('/login', auth.verifDados, async (req, res) => {
  const { login, senha } = req.body;
  try {
    const user = await helpers.getUser(login);
    if (user === null) {
      logFunction.log(`Tentativa falha de login, Usuário ${login} não existente.`)
      return res.status(422).json({ msg: 'Usuário não encontrado' });
    }
    bcrypt.compare(senha, user.senha, (err, match) => {
      if (match) {
        const token = jwt.sign({ login: user.login }, SECRET, {
          expiresIn: '30m',
        });
        return res
          .status(200)
          .json({ msg: 'Logado com sucesso', token: token });
      } else {
        logFunction.log(`Tentativa falha. Usuário '${login}' colocou a senha incorretamente.`)
        return res.status(422).json({ msg: 'Senha incorreta' })
      }
    });
  } catch (err) {
    logFunction.log(`Erro desconhecido à tentativa de login: ${err}`)
    return res
      .status(400)
      .json({ msg: 'Um erro não identificado ocorreu', err: err });
  }
});
module.exports = router;
