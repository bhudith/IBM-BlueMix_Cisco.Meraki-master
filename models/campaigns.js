
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert')
var ObjectId = require('mongodb').ObjectID;
var dbLib = require('../lib/db.js');

///////////////////////////////////////////
//database configurations
///////////////////////////////////////////


// "mongodb://IbmCloud_i0bbdnep_pktbk92c_bhnq55t0:7GeKqyscxJg5e1F7ZJukdjIl7zDYceqa@ds041063.mongolab.com:41063/IbmCloud_i0bbdnep_pktbk92c";
var dburl =dbLib.url;
var db;

///////////////////////////////////////////////////////////
//export functions
///////////////////////////////////////////////////////////
module.exports.getAllCampaigns = getAllCampaigns;


/////////////////////////////////////////////////////////
//declare functions
/////////////////////////////////////////////////////////
function getAllCampaigns(result){
	var campaigns = [];
	MongoClient.connect(dburl, function(err, database) {
		if(err) throw err;
		db = database;

		var cursor =db.collection('campaigns').find( {}, {_id: 1, name: 1, age: 1} );
		
		console.dir("internal result: " + result);
		cursor.each(function(err, doc) {
			if (doc != null) {
				
				
				if(typeof doc.id ==  'undefined') {
					doc.id = doc._id;
				}
				
				if(typeof doc.progress ==  'undefined') {
					doc.progress = 0;
				}
				
				if(typeof doc.age  ==  'undefined') {
					doc.age = 88;
				}
				
//			   campaigns.push(JSON.stringify(doc));
			   campaigns.push(doc);
				db.close();
				
			} else {
				console.dir("doc is null");
			}
			
			
		});
		
		
		return result;

	});
//	console.dir("internal msg: " + message);
//	callback(message);
	result.data = campaigns;
	return result;
};