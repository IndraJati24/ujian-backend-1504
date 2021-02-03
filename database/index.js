const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    port:3306,
    user: 'indra',
    password: '1ndr4j4t124',
    database: 'backend_2021'
})

module.exports = connection