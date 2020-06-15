var mysql = require('mysql');
var admin = require('firebase-admin');

var serviceAccount = require("./fbsa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-pay-e221a.firebaseio.com"
});



// var connection = mysql.createConnection({
//     host: 'smartpayng.com.ng',
//     database: 'smartpa2_smartpay',
//     user: 'smartpa2_smartpay',
//     password: 'hacktor12345'
// });
console.log('Connecting....');
// connection.connect((error) => {
//     if (error) {
//         console.error('Error connecting: ' + error.stack);
//         return;
//     }
//     console.log('Connected as id ' + connection.threadId);
// });

admin.firestore().collection('users').get().then((result) => {
    result.docs.forEach((doc) => {
        console.log(doc.data());
    });
})

// connection.end();