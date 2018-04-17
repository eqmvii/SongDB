var mysql = require("mysql");
var inquirer = require("inquirer");

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection;
const PADDING = 16;

function connectToDatabase() {
    connection = mysql.createConnection({
        host: 'localhost',
        port: 3306,

        user: 'root',
        password: 'password', // high security
        database: 'songsDB'
    });
    connection.connect();
}



function addSongs() {
    inquirer.prompt([
        {
            message: "artist name",
            name: "artist"
        },
        {
            message: "song title",
            name: "title"
        },
        {
            message: "genre",
            name: "genre"
        }
    ]).then(answers => {
        console.log(answers);
        connection.query('INSERT INTO songs (title, artist, genre) VALUES (?, ?, ?)', [answers.title, answers.artist, answers.genre], function () {
            inquirer.prompt([
                {
                    message: "another?",
                    type: "list",
                    name: "again",
                    choices: ["YES", "NO"]
                }
            ]).then(moreAnswers => {
                console.log(moreAnswers);
                if (moreAnswers.again === "YES") {
                    addSongs();
                } else {
                    printDB();
                }
            });
        });

    });
}

function printDB() {
    console.log();
    console.log(`${pad("      Song")}   ${pad("     Artist")}   ${pad("     Genre")}`)
    connection.query('SELECT * FROM songs', function (error, results, fields) {
        if (error) throw error;
        // console.log('Songs ', results);
        for (let i = 0; i < results.length; i++) {
            console.log(`| ${pad(results[i].title)} | ${pad(results[i].artist)} | ${pad(results[i].genre)} |`);
        }
        console.log();
        connection.end();
    });

}

// make a stirng exactly 20 monospace characters
function pad(string) {
    var more = PADDING - string.length;
    if (more < 0) {
        return string.substring(0, PADDING);
    }
    else {
        for (let i = 0; i < more; i++) {
            string += " ";
        }
    }
    return string;
}

if (process.argv[2] === "addSongs") {
    connectToDatabase();
    addSongs();
} else if (process.argv[2] === "printSongs") {
    connectToDatabase();
    printDB();
} else {
    console.log("Usage Options: ");
    console.log("nodex index.js addSongs");
    console.log("nodex index.js printSongs");

}




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
