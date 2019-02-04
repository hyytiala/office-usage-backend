const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan  = require('morgan')
//Routers

mongoose
    .connect(config.mongoUrl, {
        useNewUrlParser: true
    })
    .then( () => {
        console.log('connected to database', config.mongoUrl)
    })
    .catch( err => {
        console.log(err)
    })

mongoose.Promise = global.Promise

app.use(cors())
app.use(bodyParser.json())
app.use(morgan('tiny'))

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}