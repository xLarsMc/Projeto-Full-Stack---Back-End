//Importações e configurações
require("dotenv").config()
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();
const routes = require('./Routes/mainRoutes')
const port = process.env.PORT;;

//Leitura JSON/Configuração cors
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors({
    origin: '*'
}));

//Ligando o servidor
app.listen(port, () => {
    console.log("Working! Port: " + port);
})

//Configurando rotas
app.use('/', routes);
require("./Database/mongoConnection");