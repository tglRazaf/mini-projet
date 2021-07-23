const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./routes/router')

app.use(bodyParser.json())
app.use(cors());
app.use(router)

app.listen(7000, function(){
    console.log('app is on port:7000')
})