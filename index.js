const express = require('express');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Teste.");
})

app.listen(port, () => {
    console.log("Working!")
})