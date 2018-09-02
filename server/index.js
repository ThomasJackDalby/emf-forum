const express = require("express");
const datastore = require('nedb');
const bunyan = require('bunyan');
const bodyParser = require('body-parser');
const port = 80;

var logger = bunyan.createLogger({
    name: "test",
    streams: [{
      type: 'rotating-file',
      path: './logs/log',
    },
  {
    stream: process.stdout
  }]
});
var log = function(req, res, next) {
    logger.info("["+req.ip+"] for [" + req.originalUrl + "]");
    next();
}

var db = new datastore({ 
    filename: __dirname + "/database.db", 
    autoload: true 
});
db.insert({_id: '__autoid__', value: -1});
db.getAutoId = function(onFind) {
    db.findOne( { _id: '__autoid__' }, function(err, doc) {
        if (err) {
            onFind && onFind(err)
        } 
        else {
            // Update and returns the index value
            db.update({ _id: '__autoid__'}, { $set: {value: ++doc.value} }, {}, function(err, count) {
                onFind && onFind(err, doc.value);
            });
        }
    });
    return db;
}
var app = express();
app.use(express.static('public'));
app.use(log);
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/threads', function(req, res) {
    db.getAutoId(function(err, id) {
        var title = req.body.title;
        logger.info("Creating new thread titled: " + title);
        db.insert({ threadID: id, type: 'thread', title: title , comments: [] });
        res.send();
    });
});

app.get('/threads', function(req, res) {
    db.find({ type: 'thread'}, function(err, docs){
        if (err) logger.info("error");
        res.send(docs.map(function(source) {
            return {
                id: source.threadID,
                title: source.title
            }
        }));
    });
});

app.get('/threads/:threadID', function(req, res) {
    var threadID = parseInt(req.params.threadID);
    logger.info("GET request for thread [" + threadID + "]");
    db.find({ threadID: threadID, type: "thread" }, function(err, docs) {
        if (err) {
            logger.error("Ah shit..");
            res.send({ error: "Something went wrong with the database." });
            return;
        }
        console.log(docs);
        if (docs.length == 0) {
            res.send({ error: "No matching thread found." });
            return;
        }
        res.send({
            id: docs[0].threadID,
            title: docs[0].title,
            comments: docs[0].comments.map(function(source) {
                return source.comment;
            })
        });
    });
});

app.post('/threads/:threadID', function(req, res) {
    var threadID = parseInt(req.params.threadID);
    logger.info("POST request for comment on thread [" + threadID + "]");

    db.find({ threadID: threadID, type: "thread" }, function(err, docs) {
        if (err) {
            logger.error("Ah shit..");
            res.send({ error: "Something went wrong with the database." });
            return;
        }
        if (docs.length == 0) {
            res.send({ error: "No matching thread found." });
            return;
        }
        var thread = docs[0];
        var newThread = JSON.parse(JSON.stringify(thread));
        var comment = {
            user: req.connection.remoteAddress,
            comment: req.body.comment,
        }
        newThread.comments.push(comment);
        db.update(thread, newThread, {}, function(err){
            res.send(newThread);
        });
    });
});


app.listen(80, function() {
    console.log("Server running at http://127.0.0.1:"+port+"/");
});