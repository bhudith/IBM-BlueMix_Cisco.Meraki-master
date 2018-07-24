var express = require("express");
var router = express.Router();
// Models

var Campaign = require('../models/campaign.js');
Campaign.methods(['get', 'put', 'post', 'delete']);
Campaign.register(router, '/campaigns');



var Statcampaignage = require('../models/statcampaignage.js');
Statcampaignage.methods(['get', 'put', 'post', 'delete']);
Statcampaignage.register(router, '/statcampaignage');


router.get('/statcampaignage/list', function (req, res) {
	Statcampaignage.find({}, function (err, docs) {
        res.json(docs);
    });
});
module.exports = router;