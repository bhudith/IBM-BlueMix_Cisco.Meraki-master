var express = require("express");
var router = express.Router();

router.get("/", function(req,res){
	res.send("respond images route");
});


router.get("/uploadimage", function(req, res){
	res.sendfile("./public/images-upload.html");
});

router.post("/uploadimage", function(req, res){
	var multiparty = require("multiparty");
	var form = new multiparty.Form();
	form.parse(req, function (err, fields, files) {
		console.log(files);
//		console.log(files.images[0].originalFilename);
//		res.send("Name: " + fields.name);


		var img = files.images[0];
		var fs = require("fs");

		fs.readFile(img.path, function(err, data){
			var path = "./public/images/" + img.originalFilename;
			console.log("destination path: " + path);

			fs.writeFile(path, data, function(error){
				if(error) console.log(error);
				res.send("Upload Success");
				
				console.log("Upload Success");
			})
		})
	});


})

module.exports = router;