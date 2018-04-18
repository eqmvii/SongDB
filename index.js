var mysql = require("mysql");
var inquirer = require("inquirer");

var mysql = require('mysql');
var inquirer = require('inquirer');

var connection;
const PADDING = 16;

function connectToDatabase() {
    connection = mysql.createConnection({
        multipleStatements: true, // allows multiple queries to be executed after being separated by a semicolon
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
    console.log(`${pad("      Song")}   ${pad("       Artist")}   ${pad("       Genre")}`)
    connection.query('SELECT * FROM songs', function (error, results, fields) {
        if (error) throw error;
        for (let i = 0; i < results.length; i++) {
            console.log(`| ${pad(results[i].title)} | ${pad(results[i].artist)} | ${pad(results[i].genre)} |`);
        }
        console.log();
        main();
    });
}

function deleteDB() {
    connection.query('DELETE FROM songs', function (error, results, fields) {
        console.log("Deleted all songs...");
        main();
    });
}

function seedDB() {
    connection.query(`DELETE FROM songs; INSERT INTO songs (title, artist, genre) VALUES
            ("Walrus Song1", "The Walrus", "Walrus Step"),
            ("Walrus Song2", "The Walrus", "Walrus Step"),
            ("Walrus Song3", "The Walrus", "Walrus Step")`, function () {
        console.log("Database Seeded!");
        main();
    });
}

function seeArtists() {
    connection.query(`SELECT DISTINCT artist FROM songs`, function (error, results, fields) {
        console.log("Artists");
        console.log("-------");
        for(let i = 0; i < results.length; i++) {
            console.log(results[i].artist);
        }
        main();
    });
}

function seeGenres() {
    connection.query(`SELECT DISTINCT genre FROM songs`, function (error, results, fields) {
        console.log("Genres");
        console.log("------");
        for(let i = 0; i < results.length; i++) {
            console.log(results[i].genre);
        }
        main();
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

function main() {
    console.log();
    inquirer.prompt([
        {
            message: "What would you like to do?",
            type: "list",
            name: "choice",
            choices: ["Add Song", "Print Database", "See Artists List", "See Genres List", "Seed Database", "Delete All Songs", "Quit"]
        }
    ]).then(answer => {
        console.log();
        switch (answer.choice) {
            case "Add Song":
                if (!connection) {
                    connectToDatabase();
                }
                addSongs();
                break;
            case "Print Database":
                if (!connection) {
                    connectToDatabase();
                }
                printDB();
                break;
            case "See Artists List":
                if (!connection) {
                    connectToDatabase();
                }
                seeArtists();
                break;
            case "See Genres List":
                if (!connection) {
                    connectToDatabase();
                }
                seeGenres();
                break;
            case "Seed Database":
                if (!connection) {
                    connectToDatabase();
                }
                seedDB();
                break;
            case "Delete All Songs":
                if (!connection) {
                    connectToDatabase();
                }
                deleteDB();
                break;
            default:
                if (connection) {
                    connection.end();
                    console.log("closed connection");
                } else {
                    console.log("no connection to end");
                }
                console.log("Bye!");
        }
    }
    );

}

main();

// if (process.argv[2] === "addSongs") {
//     connectToDatabase();
//     addSongs();
// } else if (process.argv[2] === "printSongs") {
//     connectToDatabase();
//     printDB();
// } else {
//     console.log("Usage Options: ");
//     console.log("nodex index.js addSongs");
//     console.log("nodex index.js printSongs");

// }




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
