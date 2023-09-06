const mysql = require('mysql2')
const {host,db_user,db_password}=require("./config.js")
const connection = mysql.createConnection({
    host:host,
    port: '3306',
    user: db_user,
    password: db_password,
    database: 'cadastro',
    multipleStatements: true
})

module.exports=connection