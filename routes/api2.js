var express = require("express");
var router = express.Router();

// Models




var Statcampaignage = require('../models/statcampaignage.js');
Statcampaignage.methods(['get', 'put', 'post', 'delete']);
Statcampaignage.register(router, '/statcampaignage');



module.exports = router;