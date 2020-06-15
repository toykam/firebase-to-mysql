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

    admin.firestore().collection('users').get().then((result) => {
        const totalData = result.docs.length;
        var doneData = 0;
        console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
        result.docs.forEach((doc) => {
            // console.log(doc.data());
            var oneTrans = doc.data();
            var uid = oneTrans.uid;
            var first_name = '';
            var last_name = '';
            var email = oneTrans.email;
            var username = oneTrans.username;
            var password = '';
            var level = oneTrans.level;
            var phone_number = oneTrans.mobile;
            var pin = oneTrans.pin;
            var referral_code = oneTrans.referal_code;
            var referred_by = oneTrans.reffered_by;
            var device_id = oneTrans.device_id;
            var created_at = Date.now();
            var updated_at = Date.now();
            // var bonus = oneTrans.bonus;
            // var debt = oneTrans.debt != null ? oneTrans.debt : '0.0';
            var created_at = oneTrans.date != null ? oneTrans.date : Date.now();
            // var updated_at = oneTrans.date != null ? oneTrans.date : Date.now();
            // var sql = `INSERT INTO wallet_transactions (uid, balance, bonus, debt, created_at, updated_at) VALUES("${uid}", "${balance}", "${bonus}", "${debt}", "${created_at}","${updated_at}")`;
            var message = oneTrans.message;
            var type = oneTrans.type;
            // var promo_code = 'PURCHASE';
            var reference = oneTrans.reference;
            var amount = oneTrans.amount;
            var sql = `INSERT INTO users (uid, amount, reference, paid, type, message, created_at)`;
            sql += ` VALUES("${uid}", "${amount}", "${reference}", "${paid}", "${type}", "${message}", "${created_at}")`;


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