//Importações e configurações
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const routes = require('./Routes/mainRoutes');
const port = process.env.PORT;
const path = require('path')
const fs = require('fs');
const https = require('https');
const compression = require('compression');
const helmet = require('helmet');
const xss = require('xss-clean')
const privateKey = fs.readFileSync('./Certificado/key.pem', 'utf8');
const certificado = fs.readFileSync('./Certificado/cert.pem', 'utf8');
const credenciais = { key: privateKey, cert: certificado };

app.use(compression());
app.use(express.static('build'));
app.use(helmet());
app.use(xss())
//Leitura JSON/Configuração cors
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: '*',
  }),
);

//Ligando o servidor
const httpsServer = https.createServer(credenciais, app);

httpsServer.listen(port, () => {
  console.log('Working! Port: ' + port);
});

//Configurando rotas
app.use('/', routes);
require('./Database/mongoConnection');

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
