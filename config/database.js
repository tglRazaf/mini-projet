const mysql = require('mysql')
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mySchoolDb'
})


db.connect(function (err) {
    err ? console.log(err) : console.log("mySql is connected")
})

module.exports = db