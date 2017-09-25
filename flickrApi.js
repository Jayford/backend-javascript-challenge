var express = require('express');
var router = express.Router();
var app = express();
 
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