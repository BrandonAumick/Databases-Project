const express = require("express");
const app = express();
const hbs = require('hbs');


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
            susStuff: '<h1>You are sus</h1>'
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

}

main();

// Start the web server
