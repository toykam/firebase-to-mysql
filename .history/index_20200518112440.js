var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '192.3.45.50',
    database: 'smartpa2_smartpay',
    user: 'smartpa2_smartpay',
    password: ''
});
console.log('Connecting....');
connection.connect((error) => {
    if (error) {
        console.error('Error connecting: ' + error.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);
})

connection.end();