// -----------------------------------------------------------------------------
console.log("+++ Start: httpVideoServer.js");

var makeRequest = require('request');

// -----------------------------------------------------------------------------
// Webserver
// -----------------------------------------------------------------------------

var http = require("http");
var url = require("url");
var path = require("path");
var port = process.argv[2] || 8000;
var fs = require("fs");

http.createServer(function (request, response) {

    var uri = url.parse(request.url).pathname;
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function (exists) {
        console.log("+ request.url: " + request.url + ", URI: " + uri);

        // ---------------------------------------------------------------------
        if (uri === "/getToken.php") {
            console.log("++ Get Client token.");
            // request.url: /clientTokenGet.php?clientid=owluser
            theParam = request.url.substring(request.url.indexOf("?"));
            console.log("+ theParam :" + theParam + ":");
            //
            tokenHost = "obedient-machine-3163.twil.io";
            theHostnameFieldname = "&tokenhost=";
            var theIndex = request.url.indexOf(theHostnameFieldname);
            if (theIndex > 0) {
                tokenHost = request.url.substring(theIndex + theHostnameFieldname.length);
            }
            theRequest = "https://" + tokenHost + "/tokenvideo"+ theParam;
            console.log('+ theRequest:', theRequest);
            makeRequest(theRequest, function (theError, theResponse, theText) {
                theResponseStatusCode = theResponse && theResponse.statusCode;
                if (theResponseStatusCode === 200) {
                    theToken = theText;
                    // for testing: theToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiIsImN0eSI6InR3aWxpby1mcGE7dj0xIn0.eyJqdGkiOiJTS2U4ZWI2MjA1NDJhYWY2N2YzNGZiMmYxYTdjMzkyNjgwLTE1MjI5NDg1MTgiLCJpc3MiOiJTS2U4ZWI2MjA1NDJhYWY2N2YzNGZiMmYxYTdjMzkyNjgwIiwic3ViIjoiQUNhZTM2MzY4MTNlMWNiMzdiNzQ1YmM2YjEzZTYzNmMyOCIsImV4cCI6MTUyMjk1MjExOCwiZ3JhbnRzIjp7ImlkZW50aXR5IjoiMTMyMDQ0NDYiLCJ2aWRlbyI6eyJyb29tIjoiSW5jZG50XzY2In19fQ.PRCyyGanx13WCsu6p8I00MfNdP_jQPzFeqbwAnY_f2E";
                    console.log('+ theToken:', theToken);
                    response.writeHead(200);
                    response.write(theToken, "binary");
                    response.end();
                } else {
                    console.log('- Error:', theError);
                    console.log('- Status code: ' + theResponseStatusCode);
                    response.writeHead(500, {"Content-Type": "text/plain"});
                    response.write('- Error: ' + theError + "\n");
                    response.write('- Status code: ' + theResponseStatusCode + "\n");
                    response.end();
                }
            });
            return;
        }
        // ---------------------------------------------------------------------
        if (uri === "/checkQueues.php") {
            console.log("++ Check to see if there are callers in the queue.");
            // request.url: /checkQueues.php?queue=qsales
            return;
        }
        // ---------------------------------------------------------------------
        // Handle static files
        if (!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }
        if (fs.statSync(filename).isDirectory()) {
            filename += '/index.html';
        }
        fs.readFile(filename, "binary", function (err, file) {
            if (err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }
            response.writeHead(200);
            response.write(file, "binary");
            response.end();
        });

// -----------------------------------------------------------------------------
    });
}).listen(parseInt(port, 10));
console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
