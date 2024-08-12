const express = require('express');
require("dotenv").config()

const app = express();
const port = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Teste.");
})

app.listen(port, () => {
    console.log("Working!")
})

require("./Database/mongoConnection");