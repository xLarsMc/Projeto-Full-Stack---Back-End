//Importações e configurações
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const port = process.env.PORT;;

//Leitura JSON/Configuração cors
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

//Ligando o servidor
app.listen(port, () => {
    console.log("Working! Port: " + port);
})

require("./Database/mongoConnection");