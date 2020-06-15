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
    user: 'smartpa2_terminal',
    password: 'terminal12345',
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
        const totalData = result.docs.length;
        var doneData = 0;
        console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
        result.docs.forEach((doc) => {
            // console.log(doc.data());
            var oneTrans = doc.data();
            var uid = oneTrans.uid;
            var seen = oneTrans.seen;
            // var bonus = oneTrans.bonus;
            // var debt = oneTrans.debt != null ? oneTrans.debt : '0.0';
            // var created_at = oneTrans.date != null ? oneTrans.date : Date.now();
            // var updated_at = oneTrans.date != null ? oneTrans.date : Date.now();
            // var sql = `INSERT INTO notifications (uid, balance, bonus, debt, created_at, updated_at) VALUES("${uid}", "${balance}", "${bonus}", "${debt}", "${created_at}","${updated_at}")`;
            var message = oneTrans.message;
            var title = oneTrans.message;
            var created_at = Date.now();
            var seen_at = Date.now();
            // var promo_code = 'PURCHASE';
            var url = 'home';
            // var amount = oneTrans.amount;
            var sql = `INSERT INTO notifications (uid, url, seen, title, message, created_at, seen_at)`;
            sql += ` VALUES("${uid}", "${url}", "${seen}", "${title}", "${message}", "${created_at}", "${seen_at}")`;


            connection.query(sql, (error, results, fields) => {
                if (error) {
                    console.log('Error Inserting data to DB: '+error);
                    throw error;
                }
                doneData += 1;
                console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
                console.log('Insert Result: '+results+' Fields: '+fields);
                if (doneData == totalData) {
                    console.log('All Data Inserted: '+doneData);
                    connection.end();
                }
            });
        });
    });
});

// connection.end();