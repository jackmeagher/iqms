"use strict";
var express = require('express');
var app = express();
var Resource = require('./lib/Resource');
var models = require('./models');
var bodyParser  = require('body-parser');
var jwt = require('jsonwebtoken');
const secret = 'tg6bhr5dxddrtcx';
                   
var http           = require('http').createServer(app);
var io             = require('socket.io').listen(http);

var request = require('request');
var cheerio = require('cheerio');

app.set('port', process.env.PORT || 5000);

app.use(bodyParser.json());
app.use((req, res, next) => {
    var token = req.get('token');
    if (token) {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                res.status(403).json({
                    'success': false,
                    'msg': "Invalid token (perhaps expired).",
                    'error' : err
                });
            } else {
                req.user = decoded.user;
                next();
            }
        });
    } else {
        req.auth = false;
        req.user = undefined;
        next();
    }
});


var answer_routes = require('./routes/answer');
var role_routes = require('./routes/role');
var interview_routes = require('./routes/interview');
var question_routes = require('./routes/question');
var user_routes = require('./routes/user');
var tag_routes = require('./routes/tag');
var position_routes = require('./routes/position');
var candidate_routes = require('./routes/candidate');
var interviewer_routes = require('./routes/interviewer');
var candidatePosition_routes = require('./routes/candidatePosition');
var interviewQuestion_routes = require('./routes/interviewQuestion');
var feedback_routes = require('./routes/feedback');

question_routes.register(app,'');
interview_routes.register(app,'');
answer_routes.register(app,'');
user_routes.register(app,'');
role_routes.register(app,'');
tag_routes.register(app,'');
position_routes.register(app,'');
candidate_routes.register(app, '');
interviewer_routes.register(app, '');
candidatePosition_routes.register(app, '');
interviewQuestion_routes.register(app, '');
feedback_routes.register(app, '');

app.use('/static', express.static('../static'));

// middleware to add headers for cross origin requests

app.get('/scrape', function(req, res){

  //All the web scraping magic will happen here
    var url = 'https://geocent.icims.com/icims2/servlet/icims2?module=Root&action=login';
    var htmlRes = "";
    /*request(url, function(error, response, html){

        // First we'll check to make sure no errors occurred when making the request

        if(!error){
            // Next, we'll utilize the cheerio library on the returned html which will essentially give us jQuery functionality

            var $ = cheerio.load(html);

            console.log("FOUND: ");
            htmlRes = html;
            res.send(htmlRes);
        }
    })*/
    
    var c = new Date();
    var d = new Date("1 Jan 2006 00:00:00 UTC");
    var b = new Date("1 Jan 2006 00:00:00");
    var jan1offset = (d - b) / 1000 / 60;
    var e = new Date("1 Jun 2006 00:00:00 UTC");
    var a = new Date("1 Jun 2006 00:00:00");
    var jun1offset = (e - a) / 1000 / 60;
    var RemoteHost = "H" + new Date().getTime();
    request.post(url, {
        form: {
            LoginName: 'aaronwhitn4540',
            LoginPassword: 'EVW38Jik*W0f',
            RemoteHost: RemoteHost,
            jan1offset: jan1offset,
            jun1offset: jun1offset,
            browserInfo: "chrome"
        }
    }, function(error, response, body) {
        console.log("COMPLETE");
        console.log(body);
        res.send(body);
    });
})


app.all('/*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With');
    next();
});

module.exports = app;
