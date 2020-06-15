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

    admin.firestore().collection('transactions').get().then((result) => {
        const totalData = result.docs.length;
        var doneData = 0;
        console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
        result.docs.forEach((doc) => {
            // console.log(doc.data());
            var oneTrans = doc.data();
            var uid = oneTrans.uid;
            var product_name = oneTrans.product_name;
            var purchased_code = oneTrans.purchased_code;
            var request_id = oneTrans.request_id;
            var type = oneTrans.type;
            var promo_code = 'PURCHASE';
            var status = oneTrans.status;
            var created_at = oneTrans.created_at;
            var amount = oneTrans.amount;
            // var url_to_use = oneTrans.url_to_use;
            // var vt_password = oneTrans.vt_password;
            // var vt_username = oneTrans.vt_username;
            var sql = `INSERT INTO transactions (uid, product_name, purchased_code, request_id, type, promo_code, status, created_at, amount)`;
            sql += ` VALUES("${uid}", "${product_name}", "${purchased_code}", "${request_id}", "${type}", "${promo_code}", "${status}", "${created_at}", "${amount}")`;


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