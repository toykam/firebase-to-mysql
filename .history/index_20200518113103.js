var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '54.174.115.171',
    database: 'smartpa2_smartpay',
    user: 'smartpa2_smartpay',
    password: 'hacktor12345'
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