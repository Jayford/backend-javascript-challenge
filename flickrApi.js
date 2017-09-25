var express = require('express');
var router = express.Router();
var app = express();
 var Flickr = require("node-flickr");
var keys = { "api_key": "b8cbe7bed4d17de994ee70f68660be56" }
var flickr = new Flickr(keys);

var checkMandatoryInputs = function(request, response, next){

if(!request.query.query){
    response.statusCode = 400;
    response.json({statusCode:400, error:"Missing query parameter"})
}
else{
    next();
}
}
 

var generateResponse = function(request, response){

//Form The Request Object Here

//Place Holder Response

response.json("Your query was " + request.query.query)

}
 
router.get('/', [checkMandatoryInputs, generateResponse]);
module.exports = router;