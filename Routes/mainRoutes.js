//Importações
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const helpers = require('../Helpers/bdHelpers');

const jwt = require('jsonwebtoken');
const auth = require('../Helpers/auth');
const SECRET = process.env.SECRET;
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
router.post('/post', async (req, res) => {
  const { name, commonPlaces, description, drops } = req.body;
  try {
    const newPost = await helpers.newPost(
      name,
      commonPlaces,
      description,
      drops,
    );
    console.log(newPost);
    return res.status(200).json({ msg: 'Worked: ', post: newPost });
  } catch (err) {
    console.log(error);
    return res.status(500).json({ msg: 'Deu um erro!' + error });
  }
});

router.get('/post/:name', async (req, res) => {
  const { name } = req.params;
  try {
    if (name === 'all') {
      const allPosts = await helpers.getAllPost();
      if (allPosts.length === 0) {
        return res
          .status(422)
          .json({ msg: 'Não há um posts!', allPosts: allPosts });
      }
      return res.status(200).json({ msg: 'Worked: ', allPosts: allPosts });
    }
    const existPost = await helpers.getPost(name);
    if (existPost !== null) {
      return res.status(200).json({ msg: 'Worked', existPost: existPost });
    } else {
      return res
        .status(422)
        .json({ msg: 'Não há um post com esse nome!', existPost: existPost });
    }
  } catch (err) {
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
        return res.status(422).json({ msg: 'Senha incorreta' });
      }
    });
  } catch (err) {
    return res
      .status(400)
      .json({ msg: 'Um erro não identificado ocorreu', err: err });
  }
});
module.exports = router;
