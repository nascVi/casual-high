var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var bodyParser = require('body-parser');
var app = express();

var db = null;
MongoClient.connect("mongodb://localhost:27017/ch-blog", function(err, dbconn){
    if(!err) {
        console.log('connection to ch-blog!');
        db = dbconn;
    }
});

app.use(bodyParser.json());

/*pointing at the right DIR*/
app.use(express.static('../public'));

/*api function*/
app.get('/chposts', function(req, res, next) {

    db.collection('chposts', function(err, chpostsCollection) {
        chpostsCollection.find().toArray(function(err, chposts){
        return res.json(chposts);
        });
    });

});

app.post('/chposts', function(req, res, next) {

    db.collection('chposts', function(err, chpostsCollection) {
        var newchpost = {
           text: req.body.newchpost
        };

        chpostsCollection.insert(newchpost, {w:1}, function(err){
            return res.send();
        });
    });

});

app.put('/chposts/remove', function(req, res, next) { /*remove app*/

    db.collection('chposts', function(err, chpostsCollection) {
        var chPId = req.body.chpost._id;

          chpostsCollection.remove({_id: ObjectId(chPId)}, {w:1}, function(err){
              return res.send();

        });
    });

});

app.post('/chusers', function(req, res, next) { /* login app */

    db.collection('chusers', function(err, chusersCollection) {

        chusersCollection.insert(req.body, {w:1}, function(err){
            return res.send();
        });
    });

});

/*web server services launch*/
app.listen(80, function(){
    console.log('casual-high running');
});
