/**
 * Created by macmini001 on 2016/12/6.
 */

var express = require('express');
var nodejieba = require("nodejieba");
var app = express();

nodejieba.load({
    userDict: 'user.dict.utf8'
});

function Entity(entity, type, note) {
    this.entity = entity;
    this.type = type;
    this.note = note;
}

app.get('/', function(req, res) {
    var q = req.param('utterances');
    var results = nodejieba.tag(q);
    var entities = [];
    var intents = [
        {
            intent:"queryTime",
            variates:{
                date:0,
                time:0,
                station:2,
                type:2
            },
            score:0
        },
        {
            intent:"queryFee",
            variates:{
                station:1,
                type:1,
                fee:4
            },
            score:0
        },
        {
            intent:"queryTrainInfo",
            variates:{
                m:4,
                train:4
            },
            score:0
        },
        {
            intent:"greet",
            variates:{
                greet:1
            },
            score:0
        },
        {
            intent:"thank",
            variates:{
                thank:1
            },
            score:0
        }
    ];

    for (var i in results){
        var object = results[i];
        var tags = (object.tag).split(";");

        var entity = new Entity();
        entity.entity = object.word;
        entity.type = tags[0];
        entity.note = tags[1];
        entities.push(entity);

        for (var j in intents){
            var intent = intents[j];
            if (intent.variates[entity.type])
                intent.score += intent.variates[entity.type];
        }

    }
    res.send({"q" : q, "intents" : intents, "entities" : entities});
});

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

app.listen(port, ip);

module.exports = app;