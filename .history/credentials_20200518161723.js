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

    admin.firestore().collection('credentials').get().then((result) => {
        const totalData = result.docs.length;
        var doneData = 0;
        console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
        result.docs.forEach((doc) => {
            // console.log(doc.data());
            var oneTrans = doc.data();
            var commission = oneTrans.commission;
            var key_to_use = oneTrans.key_to_use;
            var l_version = oneTrans.l_version;
            var live_url = oneTrans.live_url;
            var paystack_public_key = oneTrans.paystack_public_key;
            var paystack_public_test_key = oneTrans.paystack_public_test_key;
            var paystack_secret_key = oneTrans.paystack_secret_key;
            var paystack_secret_test_key = oneTrans.paystack_secret_test_key;
            var test_url = oneTrans.test_url;
            var url_to_use = oneTrans.url_to_use;
            var vt_password = oneTrans.vt_password;
            var vt_username = oneTrans.vt_username;
            var sql = `INSERT INTO credentials (commission, key_to_use, l_version, live_url, paystack_public_key, paystack_public_test_key, paystack_secret_key, paystack_secret_test_key, test_url, url_to_use, vt_password, vt_username)`;
            sql += ` VALUES("${commission}", "${key_to_use}", "${l_version}", "${live_url}", "${paystack_public_key}", "${paystack_public_test_key}", "${paystack_secret_key}", "${paystack_secret_test_key}", "${test_url}", "${url_to_use}", "${vt_password}", "${vt_username}")`;


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