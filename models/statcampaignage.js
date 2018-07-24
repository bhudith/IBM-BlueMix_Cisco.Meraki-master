

var restful = require('node-restful');

var mongoose = restful.mongoose;
var autoIncrement = require('mongoose-auto-increment');
var dbLib = require('../lib/db.js');
console.log ("URL: " + dbLib.url);
var connection = mongoose.createConnection(dbLib.url);
autoIncrement.initialize(connection);

var StatcampaignageSchema = new mongoose.Schema({
    _id : {type: String	}
    , age :Number
    , campaignid :String
    , counter :Number
})

//var MyStatcampaignage = mongoose.model('Statcampaignage',StatcampaignageSchema);
StatcampaignageSchema.plugin(autoIncrement.plugin, 'Statcampaignage');
//connection.model('Statcampaignage',StatcampaignageSchema);
module.exports = restful.model('Statcampaignage',StatcampaignageSchema);
module.exports.connection = connection;
module.exports.StatcampaignageSchema = StatcampaignageSchema;
module.exports.autoIncrement  = autoIncrement;