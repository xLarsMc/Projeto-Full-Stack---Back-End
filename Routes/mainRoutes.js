//Importações
const express = require('express');
const router = express.Router();
const helpers = require('../Helpers/bdHelpers');

//Rota testes e instalação/deleção
router.get('/teste', (req, res) => {
    res.send("teste");
});

router.get('/install', async(req, res) => {
    try{
        const newUser1 = await helpers.newUser('Leandro', 'TesteLeandro');
        const newUser2 = await helpers.newUser('Kodi', 'TesteKodi');
        const newUser3 = await helpers.newUser('Professor', 'TesteProfessor');
        const newPost1 = await helpers.newPost('Teste1', 'Teste1', 'Teste1', 'Teste1');
        const newPost2 = await helpers.newPost('Teste2', 'Teste2', 'Teste2', 'Teste2');
        const newPost3 = await helpers.newPost('Teste3', 'Teste3', 'Teste3', 'Teste3');
        return res.status(200).json({
            msg: "Usuários criados e Posts criados", 
            user1 : newUser1, user2: newUser2, user3: newUser3,
            post1: newPost1, post2: newPost2, post3: newPost3
        });
    } catch(err){
        return res.status(400).json({msg: "Deu ruim pai", err:err});
    }
})

router.delete('/install', async (req, res) => {
    const deleteds = await helpers.deleteAll();
    res.status(200).json({msg: "deletados", deleteds: deleteds});
})

//Rota Posts
router.post('/post', async (req, res) => {
    const {name, commonPlaces, description, drops} = req.body;
    try{
        const newPost = await helpers.newPost(name, commonPlaces, description, drops);
        console.log(newPost);
        return res.status(200).json({msg: "Worked: ", post: newPost});
    } catch(err) {
        console.log(error);
        return res.status(500).json({msg: "Deu um erro!" + error});
    }
})

router.get('/post/:name', async (req, res) => {
    const {name} = req.params;
    try{
        if(name === "all"){
            const allPosts = await helpers.getAllPost()
            if(allPosts.length === 0){
                return res.status(422).json({msg: "Não há um posts!", allPosts: allPosts});
            }
            return res.status(200).json({msg: "Worked: ", allPosts: allPosts});
        }
        const existPost = await helpers.getPost(name);
        if(existPost !== null){
            return res.status(200).json({msg: "Worked", existPost: existPost});
        } else{
            return res.status(422).json({msg: "Não há um post com esse nome!", existPost: existPost});
        }
    } catch(err) {
        return res.status(400).json({msg: "Um erro não identificado ocorreu", err: err});
    }

})

module.exports = router;