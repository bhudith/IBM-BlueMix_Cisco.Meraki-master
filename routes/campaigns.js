/*eslint-env node */
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer({ dest: 'public/images/' });

var router = express.Router();
router.use(bodyParser.json()); // for parsing application/json
//router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//router.use(multer()); // for parsing multipart/form-data

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');
var mongo;
var sendgrid;
if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
//    mongo = env['mongolab'][0].credentials;
 //   sendgrid = env['sendgrid'][0].credentials;
}

var sendgrid = require("sendgrid")("GSvtdU5Hma", "wULluaVjtgQM3152");

var url = "mongodb://IbmCloud_i0bbdnep_pktbk92c_bhnq55t0:7GeKqyscxJg5e1F7ZJukdjIl7zDYceqa@ds041063.mongolab.com:41063/IbmCloud_i0bbdnep_pktbk92c";
var facebookurl = "mongodb://IbmCloud_iaqgo38q_beiehr1n_7nejpf8j:yQAY0DwgzONco_wGhHDKxnsHQ2dV_eez@ds037143.mongolab.com:37143/IbmCloud_iaqgo38q_beiehr1n";

var insertCampaign = function(db, json, callback){
	console.log("Set CampaignId Completed");
	db.collection('campaigns').insertOne( json, function(err, result) {
		console.log("Inserted Campaign Completed");
		console.log(result);
		callback();
	});
};

var getCampaign = function(db, campaignid, callback){
	console.log(campaignid);
	console.log(ObjectId(campaignid));
	var cursor = db.collection('campaigns').find({"_id":ObjectId(campaignid)});
	cursor.each(function(err, doc) {
      assert.equal(err, null);
      if (doc != null) {
		console.dir(doc);
		callback(doc);
	}
   });
};

var removeMongoId = function(json, callback){
	delete json._id;
	console.log("Delete Mongo Id");
	callback(json);
};

var updateCampaign = function(db, json, callback){
	console.log("Update Campaign");
	console.log(json._id);
	var id = json._id;
	removeMongoId(json, function(json){
		console.log(json);
		db.collection('campaigns').replaceOne({"_id":ObjectId(id)} ,json, function(err, results){
			console.log("Result: "+results);
			console.log("Err: "+err);
			callback();
		});
	});
};

var sendEmail = function(campaign,users){
	var email;

	
	for(var i=0;i<users.length;i++){
			console.log( users[i].fb_email);
		if(campaign.imagePath != undefined){
		 email = new sendgrid.Email({
			to      : users[i].fb_email,
  			from    : 'surawatk@isd.th.ibm.com',
  			subject : campaign.email.subject,
 	 		text    : campaign.email.body + campaign.email.footer,
 	 		html 	: '<html><body><img src="cid:imageCampaign"/><p>'+campaign.email.body+'</p><br>'+campaign.email.footer+'</body></html>'.replace(/\n/g, "<br />"),
 	 		files	: [
 	   			{
					cid:          'imageCampaign',
					path:         "public/"+campaign.imagePath
				}
			],
		});
	}else{
		email = new sendgrid.Email({
			to      : users[i].fb_email,
  			from    : 'surawatk@isd.th.ibm.com',
  			subject : campaign.email.subject,
 	 		text    : campaign.email.body + campaign.email.footer,
 	 		html 	: '<html><body><p>'+campaign.email.body+'</p><br>'+campaign.email.footer+'</body></html>'.replace(/\n/g, "<br />")
		});		
	}
		sendgrid.send(email, function(err, json) {
		if (err) {
			return console.error(err); 
		}
 	 	console.log(json);
	});
	}

};

var getFacebookEmail = function(fbdb,callback){
	var cursor = fbdb.collection('MerakiDevice').find({});
	var users = [];
	cursor.each(function(err, doc) {
    	assert.equal(err, null);
    	if (doc != null) {
			console.dir(doc);
			users.push(doc);
		}else{
			callback(users);
			fbdb.close();
		}
	});
};

var removeCampaign = function(db, campaignidarray, callback) {
	for (var i = 0; i <= campaignidarray.length; i++) {
		console.log("Delete "+campaignidarray[i]);
	    db.collection('campaigns').deleteOne({
	            "_id": ObjectId(campaignidarray[i])
	        },
	        function(err, results) {
	            console.log(results);
	        }
	    );
	    if (i == campaignidarray.length) {
	    	console.log("Call Callback");
	        callback();
	    }
	}
};


router.post("/create",function(req,res){
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
		insertCampaign(db, req.body, function(){
  			db.close();
  			res.sendStatus(200);
  		});
  	});
});

router.get("/get/:id",function(req,res){
	console.log('Get Campaign Id:' + req.params.id);
	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		getCampaign(db,req.params.id, function(campaign){
  			db.close();
  			res.json(campaign);
  		});
  	});
});

router.post("/update",function(req,res){
	console.log('Update Campaign Id:' + req.body._id);
	console.log(req.body);
	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		updateCampaign(db, req.body, function(){
  			db.close();
  			res.send('Update Completed');
  		});
  	});
});

router.get("/email/:id", function(req,res){
	console.log('Send Email for Campaign Id:' + req.params.id);
	MongoClient.connect(url, function(err, db) {
  		assert.equal(null, err);
  		getCampaign(db,req.params.id, function(campaign){
			db.close();
			MongoClient.connect(facebookurl, function(err, fbdb) {
				getFacebookEmail(fbdb, function(users){
					sendEmail(campaign,users);
  					res.send('Send Email Completed');
				});
			});
	  	});
  	});
});


router.post("/upload/image/", upload.single('file'), function(req,res){
	//var file = req.files.file;
    console.log(req.file.path);
	res.send(req.file.path);
});

router.post("/delete",function(req, res) {
	console.log("test ddd");
	var campaignidarray = req.body.selectCampaignArray;
	console.log("test aaa");
	console.log(campaignidarray);

	MongoClient.connect(url, function(err, db) {
	    removeCampaign(db, campaignidarray, function() {
	        db.close();
	        console.log("Delete Done");
	        res.sendStatus(200);
	    });
	});
});

module.exports = router;