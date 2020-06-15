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

    admin.firestore().collection('wallet').get().then((result) => {
        const totalData = result.docs.length;
        var doneData = 0;
        console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
        result.docs.forEach((doc) => {
            // console.log(doc.data());
            var oneTrans = doc.data();
            var uid = oneTrans.uid;
            var balance = oneTrans.balance;
            var bonus = oneTrans.bonus;
            var debt = oneTrans.debt;
            var promo = oneTrans.promo;
            var created_at = Date.now();
            var updated_at = Date.now();
            // var promo_code = 'PURCHASE';
            // var status = oneTrans.status;
            // var created_at = oneTrans.created_at;
            // var amount = oneTrans.amount;
            // var url_to_use = oneTrans.url_to_use;
            // var vt_password = oneTrans.vt_password;
            // var vt_username = oneTrans.vt_username;
            var sql = `INSERT INTO wallet (uid, balance, bonus, debt, promo, created_at, updated_at)`;
            sql += ` VALUES("${uid}", "${balance}", "${bonus}", "${debt}", "${promo}", "${created_at}", "${updated_at}")`;


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