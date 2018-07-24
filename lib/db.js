var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var username = "IbmCloud_i0bbdnep_pktbk92c_bhnq55t0";
var password = '7GeKqyscxJg5e1F7ZJukdjIl7zDYceqa'
var address = '@ds041063.mongolab.com:41063/IbmCloud_i0bbdnep_pktbk92c'
var url = "mongodb://"+username + ":" + password + address

//$ mongo   ds041063.mongolab.com:41063/IbmCloud_i0bbdnep_pktbk92c   -u IbmCloud_i0bbdnep_pktbk92c_bhnq55t0  -p 7GeKqyscxJg5e1F7ZJukdjIl7zDYceqa

module.exports.url = url;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
module.exports.connect = connect;
module.exports.disconnect = disconnect;


function connect(){
url = "mongodb://"+username + ":" + password + address
console.log('[*] Connecting to the database');
mongoose.connect(url);
}

function disconnect(){
    console.log('[*] Disconnecting ..');
    mongoose.disconnect()}

