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

    admin.auth().listUsers(1000).then((result) => {
        // console.log(result.users);
        var doneData = 0;
        const totalData = result.users.length;
        console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
        result.users.forEach((user) => {
            var email = user.email;
            var fullName = user.displayName.split(' ');
            var first_name = fullName[0];
            var last_name = fullName[1] ? fullName[1] : '';
            var status = user.emailVerified == true ? 'active' : 'pending';
            var uid = user.uid;
            var password = 'defaultsmartpay';
            
            var updateSql = `UPDATE users set password = ""${password}, first_name = "${first_name}", last_name = "${last_name}", status = "${status}" WHERE email = "${email}" AND uid = "${uid}"`;
            connection.query(updateSql, (error, results, fields) => {
                if (error) {
                    console.log('Error Inserting data to DB: '+error);
                    throw error;
                }
                doneData += 1;
                console.log('All Updated Data: '+doneData);
                console.log('Insert Result: '+JSON.stringify(results)+' Fields: '+fields);
                if (doneData == totalData) {
                    console.log('All Data Inserted: '+doneData);
                    connection.end();
                }
            });
            
            // console.log(status);
        });
    });

    // admin.firestore().collection('users').get().then((result) => {
    //     const totalData = result.docs.length;
    //     var doneData = 0;
    //     console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
    //     result.docs.forEach((doc) => {
    //         // console.log(doc.data());
    //         var oneTrans = doc.data();
    //         var uid = oneTrans.uid;
    //         var first_name = '';
    //         var last_name = '';
    //         var email = oneTrans.email;
    //         var username = oneTrans.username;
    //         var password = '';
    //         var acct_type = 'USER';
    //         var phone_number = oneTrans.mobile;
    //         var pin = oneTrans.pin;
    //         var referral_code = oneTrans.referal_code;
    //         var referred_by = oneTrans.reffered_by;
    //         var device_id = oneTrans.device_id;
    //         var created_at = Date.now();
    //         var updated_at = Date.now();

    //         var sql = `INSERT INTO users (uid, first_name, last_name, email, username, password, acct_type, phone_number, pin, referral_code, referred_by, device_id, created_at, updated_at)`;
    //         sql += ` VALUES("${uid}", "${first_name}", "${last_name}", "${email}", "${username}", "${password}", "${acct_type}", "${phone_number}", "${pin}", "${referral_code}", "${referred_by}", "${device_id}", "${created_at}", "${updated_at}")`;


    //         connection.query(sql, (error, results, fields) => {
    //             if (error) {
    //                 console.log('Error Inserting data to DB: '+error);
    //                 throw error;
    //             }
    //             doneData += 1;
    //             console.log('Total Data Retrieved: '+totalData+', All Data Inserted: '+doneData);
    //             console.log('Insert Result: '+JSON.stringify(results)+' Fields: '+fields);
    //             if (doneData == totalData) {
    //                 console.log('All Data Inserted: '+doneData);
    //                 connection.end();
    //             }
    //         });
    //     });
    // });
});

// connection.end();