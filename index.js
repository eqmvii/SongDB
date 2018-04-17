var mysql = require("mysql");
var inquirer = require("inquirer");

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    user: 'root',
    password: 'password', // high security
    database: 'songsDB'
});

connection.connect();

function addSongs() {
    inquirer.prompt([
        {
            message: "artist name",
            name: "artist"
        }
        // ,
        // {
        //     message: "song title",
        //     name: "title"
        // },
        // {
        //     message: "genre",
        //     name: "genre"
        // }
    ]).then(answers => {
        console.log(answers);
        inquirer.prompt([
        {
            message: "another?",
            type: "list",
            name: "again",
            choices: ["YES", "NO" ]
        }
        ]).then(moreAnswers => {
            console.log(moreAnswers);
            if (moreAnswers.again === "YES") {
                addSongs();
            } else {
                connection.end();
            }
        })
    });
}

addSongs();



// connection.query('SELECT * FROM songs', function (error, results, fields) {
//     if (error) throw error;
//     console.log('Songs ', results);
//     connection.end();
// });




// It worked! Output:

/*
$ node index.js
Songs  [ RowDataPacket {
    id: 1,
    title: 'walrus song',
    artist: 'MeMyselfAndI',
    genre: 'greatMusic' } ]
*/
