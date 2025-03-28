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

    dbInfo = {
        host: "localhost",
        user: "root",
        password: ""
    };

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
            susStuff: ''
        });
    });

    app.get('/vehiclePage', (req, res) => {
        res.render("vehiclePage", {
            susStuff: ''
        });
    });

    app.get('/retailerPage', (req, res) => {
        res.render("retailerPage", {
            susStuff: ''
        });
    });

    app.post('/susPage', async (req, res) => {

        let db = makeDb(dbInfo);

        await db.query('USE `the-offenders`;');

        let attributes = {person_ID: '^*', address: '^*', bDay: '^*', fName: '^*', lName: '^*', mInt: '^*', dlNum: '^*'};

        for (id in attributes) {
            if (req.body[id]) {
                attributes[id] = req.body[id];
            }
        }

        let result = await db.query(`SELECT * FROM subject WHERE person_ID REGEXP "${attributes['person_ID']}" AND address REGEXP "${attributes['address']}" 
                                    AND fName REGEXP "${attributes['fName']}" AND lName REGEXP "${attributes['lName']}" 
                                    AND mInt REGEXP "${attributes['mInt']}" AND dlNum REGEXP "${attributes['dlNum']}";`);

        let sendString = "";

        for (person of result) {
            sendString += `| ${person['person_ID']} | ${person['address']} | ${person['bDay']} | ${person['fName']} | ${person['lName']} | ${person['mInt']} | ${person['dlNum']} |\n`;
        }

        res.render("susPage", {
            susStuff: sendString
        });

    });

    app.post('/theftPage', async (req, res) => {

        let db = makeDb(dbInfo);

        await db.query('USE `the-offenders`;');

        let attributes = {theftEvent_ID: "^*", theftType: "^*", status: "^*", te_crt_CaseNum: "^*", te_retailer_ID: "^*"};

        for (id in attributes) {
            if (req.body[id]) {
                attributes[id] = req.body[id];
            }
        }

        let result = await db.query(`SELECT * FROM \`theft event\` WHERE theftEvent_ID REGEXP "${attributes['theftEvent_ID']}" AND theftType REGEXP "${attributes['theftType']}" 
                                    AND status REGEXP "${attributes['status']}" AND te_crt_CaseNum REGEXP "${attributes['te_crt_CaseNum']}" 
                                    AND te_retailer_ID REGEXP "${attributes['te_retailer_ID']}";`);

        let sendString = "";

        for (theft of result) {
            sendString += `| ${theft['theftEvent_ID']} | ${theft['theftType']} | ${theft['date']} | ${theft['time']} | ${theft['status']} | ${theft['te_crt_CaseNum']} | ${theft['te_retailer_ID']} |\n`;
        }

        res.render("theftPage", {
            susStuff: sendString
        });

    });

    app.post('/vehiclePage', async (req, res) => {

        let db = makeDb(dbInfo);

        await db.query('USE `the-offenders`;');

        let attributes = {vehicle_ID: '^*', make: '^*', model: '^*', plateNum: '^*', color: '^*'};

        for (id in attributes) {
            if (req.body[id]) {
                attributes[id] = req.body[id];
            }
        }

        let result = await db.query(`SELECT * FROM vehicle WHERE vehicle_ID REGEXP "${attributes['vehicle_ID']}" AND make REGEXP "${attributes['make']}" 
                                    AND model REGEXP "${attributes['model']}" AND plateNum REGEXP "${attributes['plateNum']}" 
                                    AND color REGEXP "${attributes['color']}";`);

        let sendString = "";

        for (vehicle of result) {
            sendString += `| ${vehicle['vehicle_ID']} | ${vehicle['make']} | ${vehicle['model']} | ${vehicle['plateNum']} | ${vehicle['color']} |\n`;
        }

        res.render("vehiclePage", {
            susStuff: sendString
        });


    });

    app.post('/retailerPage', async (req, res) => {

        let db = makeDb(dbInfo);

        await db.query('USE `the-offenders`;');

        let attributes = {retailer_ID: '^*', name: '^*', address: '^*', phoneNum: '^*'};

        for (id in attributes) {
            if (req.body[id]) {
                attributes[id] = req.body[id];
            }
        }

        let result = await db.query(`SELECT * FROM retailer WHERE retailer_ID REGEXP "${attributes['retailer_ID']}" AND name REGEXP "${attributes['name']}" 
                                    AND address REGEXP "${attributes['address']}" AND phoneNum REGEXP "${attributes['phoneNum']}";`);

        let sendString = "";

        for (retailer of result) {
            sendString += `| ${retailer['retailer_ID']} | ${retailer['name']} | ${retailer['address']} | ${retailer['phoneNum']} |\n`;
        }

        res.render("retailerPage", {
            susStuff: sendString
        });


    });

    app.get('/susInfo', async (req, res) => {

        let db = makeDb(dbInfo);

        await db.query("USE `the-offenders`;")
        let person = await db.query(`SELECT fName, mInt, lName FROM subject WHERE person_ID="${req.query.susID}"`);
        let retailers = await db.query(`SELECT name FROM retailer WHERE retailer_ID IN (SELECT te_retailer_ID FROM \`theft event\` WHERE theftEvent_ID IN (
                                        SELECT s_theftEvent_ID FROM steals WHERE s_person_ID="${req.query.susID}"))`);

        let vehicles = await db.query(`SELECT color, make, model FROM vehicle WHERE vehicle_ID IN 
                                        (SELECT vu_vehicle_ID FROM vehicle_used WHERE vu_person_ID="${req.query.susID}");`)

        let retailerString ="";
        let vehicleString = "";

        for (r of retailers) {
            retailerString += `${r['name']}\n`;
        }

        for (v of vehicles) {
            vehicleString += `${v['color']} ${v['make']} ${v['model']}\n`;
        }

        res.render('susInfo', {
            suspectName: `${person[0]['fName']} ${person[0]['mInt']} ${person[0]['lName']}`,
            stolenRetailers: retailerString,
            usedVehicles: vehicleString
        });

    });

    app.get('/retailerInfo', async (req, res) => {

        let db = makeDb(dbInfo);

        await db.query("USE `the-offenders`;")
        let retailer = await db.query(`SELECT name FROM retailer WHERE retailer_ID="${req.query.retailerID}"`);
        let subjects = await db.query(`SELECT fName, lName FROM subject, retailer, steals, \`theft event\` WHERE person_ID=s_person_ID AND retailer_ID=te_retailer_ID AND s_theftEvent_ID=theftEvent_ID AND retailer_ID="${req.query.retailerID}";`);

        let subjectString ="";

        for (s of subjects) {
            subjectString += `${s['fName']} ${s['lName']}\n`;
        }

        res.render('retailerInfo', {
            retailerName: retailer[0]['name'],
            relatedSuspects: subjectString
        });

    });

}

main();
