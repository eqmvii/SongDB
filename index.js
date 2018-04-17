var mysql = require("mysql");

var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'password', // high security
    database: 'songsDB'
});

connection.connect();

connection.query('SELECT * FROM songs', function (error, results, fields) {
    if (error) throw error;
    console.log('Songs ', results);
    connection.end();
});

// It worked! Output:

/*
$ node index.js
Songs  [ RowDataPacket {
    id: 1,
    title: 'walrus song',
    artist: 'MeMyselfAndI',
    genre: 'greatMusic' } ]
*/
