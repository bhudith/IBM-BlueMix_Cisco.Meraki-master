

var restful = require('node-restful');
var mongoose = restful.mongoose;


var CampaignsSchema = new mongoose.Schema({
    id : {type: String,unique:true}
    , name :String
    , progress:Number
})


//var MyCampaigns = mongoose.model('Campaigns',CampaignsSchema);

module.exports = restful.model('Campaigns',CampaignsSchema);
