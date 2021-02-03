const express = require('express')
const cors = require('cors')
const bodyparser = require('body-parser')

// main app
const app = express()

// apply middleware
app.use(cors())
app.use(bodyparser.json())

const database = require('./database')
database.connect((err) => {
    if(err) return console.log("error connecting: " + err.stack)
    console.log(" connected to mysql as id " + database.threadId)
})

const { userRouter, movieRouter } = require('./router')
app.use('/user', userRouter)
app.use('/movies', movieRouter)

// main route
const response = (req, res) => res.status(200).send('<h1>REST API JCWM1504</h1>')
app.get('/', response)

// bind to local machine
const PORT = 2000
app.listen(PORT, () => `CONNECTED : port ${PORT}`)