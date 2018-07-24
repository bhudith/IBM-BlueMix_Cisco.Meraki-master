var express = require("express");
var http = require('http');
var cfenv = require('cfenv');
var appEnv = cfenv.getAppEnv();
var router = express.Router();

router.get("/", function(req,res){
	res.send("testing route respond campaign route");
});


router.get("/list", function(req,res){
	
	pullCompains(null, function(campaigns){
		res.send(campaigns);
	});
	
});


router.get("/get/:id", function(req,res){
	
	pullCompains(req.params.id, function(campaigns){
		res.send(campaigns);
	});
	
});


router.get("/genStatAge/:campid/:age/:counter", function(req,res){
	var result;
	createStatCompainAge(req.params.campid, req.params.age, req.params.counter, function(result){
//		res.send(result);
		res.json(result);
	});
	
});


///////////////////////////////////////////////////////////////////////////////////////////////////////////
function pullCompains(id, callback) {
	var paramId = "";
	
	if(id !=null) {
		paramId = "/" + id;
	}
	
	console.dir("paramId: " + paramId);
    return http.get({
        host: appEnv.bind,
        path: '/api/campaigns' + paramId,
        port: appEnv.port
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {

            // Data reception is done, do whatever with it!
        	var parsed = null;
        	try {
                parsed = JSON.parse(body);
//                console.dir("parsed: " + parsed)
//                console.dir("typeof parsed: " + (typeof parsed))
                if (typeof parsed != 'undefined' ) {
                	
                	if(typeof parsed.length !=  'undefined'){
                		for(var i=0; i < parsed.length; i++) {
                			assignPropertyCampaign(parsed[i]);
                	    }
                	}else{
                		assignPropertyCampaign(parsed);
                	}
                }
            } catch (err) {
                console.error('Unable to parse response as JSON', err);
            }
           
            callback({
            	campaigns: parsed
            });
        });
        response.on('error', function(err) {
            // handle errors with the request itself
            console.error('Error with the request:', err.message);
//            cb(err);
        });

    });

};

function assignPropertyCampaign(campaign) {
	try {
	    
	    if (typeof campaign.id == 'undefined') {
	    	campaign.id = campaign._id;
	    }
	    if (typeof campaign.progress == 'undefined') {
	    	campaign.progress = 0;
	    }
	    if (typeof campaign.age == 'undefined') {
	    	campaign.age = {};
	    }
	    if (typeof campaign.age.data == 'undefined') {
	    	campaign.age.data =[70, 120, 88, 113];
	    }
	    if (typeof campaign.gender == 'undefined') {
	    	campaign.gender = {};
	    }
	    if (typeof campaign.gender.data == 'undefined') {
	    	campaign.gender.data = [55, 78, 43];
	    }
	    if (typeof campaign.visitor == 'undefined') {
	    	campaign.visitor = {};
	    }
	    if (typeof campaign.visitor.labels == 'undefined') {
	    	campaign.visitor.labels = ["11-Aug-2015", "12-Aug-2015", "13-Aug-2015", "14-Aug-2015", "15-Aug-2015"];
	    }
	    if (typeof campaign.visitor.data == 'undefined') {
	    	campaign.visitor.data =[[45, 120, 56, 80, 145]];
	    }
	    
	    
//	    console.log(campaign);
	 } catch (err) {
         console.error('failed to assignPropertyCampaign()', err);
     }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////


var Statcampaignage = require('../models/statcampaignage.js');
function createStatCompainAge(campid,  p_age, counter, callback) {
	// create a new Stat
	var newStat = Statcampaignage({
	  age: p_age,
	  campaignid:  campid  ,
	  counter: counter
	});

	// save the user
	newStat.save(function(err) {
	  if (err) throw err;

	  console.log('newStat created!');
	});
	
	Statcampaignage.find({}, function (err, docs) {
//        res.json(docs);
		callback({
        	result: docs
        });
    });
//    console.log('[*] Disconnecting ..');
//    mongoose.disconnect();
	
};

module.exports = router;