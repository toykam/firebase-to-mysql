var mysql = require('mysql');
var admin = require('firebase-admin');

var serviceAccount = require("./fbsa.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smart-pay-e221a.firebaseio.com"
});

var connection = mysql.createConnection({
    host: 'smartpayng.com.ng',
    database: 'smartpa2_smartpay',
    user: 'smartpa2_smartpay',
    password: 'hacktor12345',
    port: 3306,
});
console.log('Connecting...');
connection.connect((error) => {
    if (error) {
        console.error('Error connecting: ' + error.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId);

    admin.firestore().collection('notifications').get().then((result) => {
        result.docs.forEach((doc) => {
            console.log(doc.data());
            var oneNote = doc.data();
            var message = oneNote.message;
            var uid = oneNote.uid;
            var seen = oneNote.seen;
            var created_at = oneNote.date;
            var seen_at = oneNote.date;
            var sql = `INSERT INTO notifications (uid, message, seen, created_at, seen_at) VALUES("${uid}", "${message}", "${seen}", "${created_at}", "${seen_at}")`;
            connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.log('Error Inserting data to DB: '+error);
                    throw error;
                }
                results.forEach(result => {
                    console.log(result);
                });
            });
        });
    });
});

// connection.end();