/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dbLib = require('./lib/db.js');
var connection = mongoose.connect(dbLib.url);



///////////////////////////////////////////////////////////
//Model
///////////////////////////////////////////////////////////
var  Campaign = require('./models/campaigns.js');


// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use("/images", require("./routes/images"));  //for testing upload file
app.use("/rest/campaign", require("./routes/campaign"));
app.use('/campaigns', require('./routes/campaigns'));// Pung
app.use("/api", require("./routes/api"));
app.use("/api2", require("./routes/api2"));
///////////////////////////////////////////////////////////////////
// route
///////////////////////////////////////////////////////////////////
app.get("/rest/campaigns/pull", function(req,res){

	var result = new Object();
	

	
	var rs = Campaign.getAllCampaigns(result);
	setTimeout(function(){
		
	
	console.dir("after pull campaigns rs: " +result );

	console.dir("after pull campaigns rs data: " +result.data );
//	res.send(result);
//	res.send("respond pull campaign route");
	
	 res.send(JSON.stringify(result.data));
	 
	},3000);
}
);



//app.use("model.campaign", Campaign);

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, function() {

	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
