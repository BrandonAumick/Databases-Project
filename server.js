const express = require("express");
const app = express();
const hbs = require('hbs');
const mysql = require('mysql');
const util = require('util');


function makeDb( config ) {

    const connection = mysql.createConnection( config );  return {
      query( sql, args ) {
        return util.promisify( connection.query )
          .call( connection, sql, args );
      },
      close() {
        return util.promisify( connection.end ).call( connection );
      }
    };

  }


async function main() {

    app.use(express.static("homepage"));
    app.use(express.urlencoded({extended: false}));
    app.set("view engine", "html");
    app.engine('html', hbs.__express);

    app.listen(3000, function() {
        console.log("Listening on port 3000...");
     });

    app.get('/susPage', (req, res) => {
        res.render("susPage", {
            susStuff: ''
        });
    });

    app.get('/theftPage', (req, res) => {
        res.render("theftPage", {
            susStuff: '<h1>You are sus</h1>'
        });
    });

    app.get('/vehiclePage', (req, res) => {
        res.render("vehiclePage", {
            susStuff: '<h1>You are sus</h1>'
        });
    });

    app.post('/susPage', async (req, res) => {

        let db = makeDb({
            host: "localhost",
            user: "root",
            password: "&r!Xfy%te7uD#3UZ6S&C"
        });

        await db.query('USE `the-offenders`;');

        let attributes = {person_ID: '^*', address: '^*', bDay: '^*', fName: '^*', lName: '^*', mInt: '^*', dlNum: '^*'};

        for (id in attributes) {
            if (req.body[id]) {
                attributes[id] = req.body[id];
            }
        }

        console.log(attributes);

        let result = await db.query(`SELECT * FROM subject WHERE person_ID REGEXP "${attributes['person_ID']}" AND address REGEXP "${attributes['address']}" 
                                    AND fName REGEXP "${attributes['fName']}" AND lName REGEXP "${attributes['lName']}" 
                                    AND mInt REGEXP "${attributes['mInt']}" AND dlNum REGEXP "${attributes['dlNum']}";`)

        let sendString = "";

        for (person of result) {
            sendString += `| ${person['person_ID']} | ${person['address']} | ${person['bDay']} | ${person['fName']} | ${person['lName']} | ${person['mInt']} | ${person['dlNum']} |\n`;
        }

        res.render("susPage", {
            susStuff: sendString
        });

    });

}

main();


