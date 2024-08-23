const fs = require('fs')
const path = require('path')

const logFilePath = path.join(__dirname, '..', 'logs', 'server.log')

module.exports = {
    log: (message) => {
        const time = new Date().toISOString();
        const logMsg = `${time} - ${message}\n`

        fs.appendFile(logFilePath, logMsg, (err) => {
            if (err){
                console.log("Erro ao escrever log", err)
            }
        })
    }
}