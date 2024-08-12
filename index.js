const express = require('express');
const cors = require('cors');
require("dotenv").config()

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Teste.");
})

app.use(cors());

app.listen(port, () => {
    console.log("Working!")
})

require("./Database/mongoConnection");