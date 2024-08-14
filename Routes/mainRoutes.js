//Importações
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const helpers = require('../Helpers/bdHelpers');

const jwt = require('jsonwebtoken');
const auth = require('../Helpers/auth');

//Rota testes e instalação/deleção
router.get('/teste', async (req, res) => {
  res.send('teste');
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
    );
    const newPost2 = await helpers.newPost(
      'Teste2',
      'Teste2',
      'Teste2',
      'Teste2',
    );
    const newPost3 = await helpers.newPost(
      'Teste3',
      'Teste3',
      'Teste3',
      'Teste3',
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

router.post('/login', auth.verifDados, async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await helpers.getUser(login);
    if (user === null) {
      return res.status(422).json({ msg: 'Usuário não encontrado' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const token = jwt.sign({ login: user.login }, process.env.SECRET);
      return res.status(200).json({ msg: 'Logado com sucesso', token: token });
    } else {
      return res.status(422).json({ msg: 'Senha incorreta' });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ msg: 'Um erro não identificado ocorreu', err: err });
  }
});
module.exports = router;
