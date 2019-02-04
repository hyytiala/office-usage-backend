const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors')
const config = require('./utils/config')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const morgan  = require('morgan')
//Routers
const groupsRouter = require('./controllers/groups')
const usagesRouter = require('./controllers/usages')

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

app.use('/api/groups', groupsRouter)
app.use('/api/usages', usagesRouter)

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