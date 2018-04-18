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
    inquirer.prompt([
        {
            message: "Are you sure?",
            type: "list",
            name: "choice",
            choices: ["No", "Yes"]
        }
    ]).then(answer => {
        if (answer.choice === "Yes") {
            deleteDBconfirmed();
        } else {
            console.log("Then I won't do that!");
            main();
        }
    });
}

function deleteDBconfirmed() {
    connection.query('DELETE FROM songs', function (error, results, fields) {
        console.log("Deleted all songs...");
        main();
    });
}

function seedDB() {
    inquirer.prompt([
        {
            message: "Are you sure?",
            type: "list",
            name: "choice",
            choices: ["No", "Yes"]
        }
    ]).then(answer => {
        if (answer.choice === "Yes") {
            seedDBconfirmed();
        } else {
            console.log("Then I won't do that!");
            main();
        }
    });
}

function seedDBconfirmed() {
    connection.query(`DELETE FROM songs; INSERT INTO songs (title, artist, genre) VALUES
    ("Walrus Song1", "The Walrus", "Walrus Step"),
    ("Bangarang", "Skrillex", "EDM"),
    ("Ghosts'n'Stuff", "Deadmau5", "EDM"),
    ("Digitol", "Deadmau5", "EDM"),
    ("Walrus Song2", "The Walrus", "Walrus Step"),
    ("Sofi Needs a Ladder", "Deadmau5", "EDM"),
    ("Strobe", "Deadmau5", "EDM"),
    ("Californication", "The Red Hot Chili Peppers", "Rock"),
    ("Walrus Song3", "The Walrus", "Walrus Step")`, function () {
            console.log("Database Seeded!");
            main();
        });

}

function seeArtists() {
    connection.query(`SELECT DISTINCT artist FROM songs`, function (error, results, fields) {
        console.log("Artists");
        console.log("-------");
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].artist);
        }
        main();
    });
}

function seeGenres() {
    connection.query(`SELECT DISTINCT genre FROM songs`, function (error, results, fields) {
        console.log("Genres");
        console.log("------");
        for (let i = 0; i < results.length; i++) {
            console.log(results[i].genre);
        }
        main();
    });
}

function deleteOneSong() {
    connection.query(`SELECT * FROM songs`, (error, results, fields) => {
        var choices = [];
        for (let i = 0; i < results.length; i++) {
            choices.push(`${pad(results[i].id, 4)}|${results[i].title}|${results[i].artist}|${results[i].genre}`);
        }
        inquirer.prompt([
            {
                message: "What would you like to do?",
                type: "list",
                name: "choice",
                choices: choices
            }
        ]).then(answer => {
            var idToDelete = deParse(answer.choice);
            connection.query('DELETE FROM songs WHERE id = ?', [idToDelete], (error, results, fields) => {
                console.log();
                console.log(`! Deleted song ${answer.choice}`);
                console.log();
                main();
            });
        });
    });
}

function deParse(glob) {
    console.log(glob.indexOf("|"));
    return glob.substring(0, glob.indexOf("|"));
}

// make a stirng exactly 20 monospace characters
function pad(string, paddingLength = PADDING) {
    string = "" + string; // hack to ensure stringificaiton of argument
    var more = paddingLength - string.length;
    if (more < 0) {
        return string.substring(0, paddingLength);
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
            choices: [
                "Add Song",
                "Delete one Song",
                "Print Database",
                "See Artists List",
                "See Genres List",
                "Seed Database",
                "Delete All Songs",
                "Quit" ]
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
            case "Delete one Song":
                if (!connection) {
                    connectToDatabase();
                }
                deleteOneSong();
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
