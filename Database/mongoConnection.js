mongoose = require("mongoose");

dbUser = process.env.DB_USER;
dbPass = process.env.DB_PASS;

const connect = () => {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@fullstack.9hptf.mongodb.net/?retryWrites=true&w=majority&appName=FullStack`);

    const connection = mongoose.connection;

    connection.on("error", () => {
        console.log("Erro ao conectar no banco");
    });

    connection.on("open", () => {
        console.log("Conectado ao mongoDB com sucesso!");
    })
}

connect();

module.exports = mongoose;