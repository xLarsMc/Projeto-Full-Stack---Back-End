mongoose = require("mongoose");

dbUser = process.env.DB_USER;
dbPass = process.env.DB_PASS;

const connect = () => {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@fullstack.9hptf.mongodb.net/?retryWrites=true&w=majority&appName=FullStack`,{
        maxPoolSize: 5,
        minPoolSize: 1,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 100000,
        serverSelectionTimeoutMS: 3000,
        family: 4
    });

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