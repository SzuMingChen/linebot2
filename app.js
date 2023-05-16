require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const userAccountController = require("./app/controller/user");

// 設定 port
const PORT = process.env.PORT || 2000

// 設定 bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))


app.get('/', (req, res) => {
    res.send('Hello World!')
})


require('./app/routes')(app);


app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})