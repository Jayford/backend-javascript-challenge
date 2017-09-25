var express = require('express');
var router = express.Router();
var app = express();
var Flickr = require("node-flickr");
var keys = { "api_key": "b8cbe7bed4d17de994ee70f68660be56" }
var flickr = new Flickr(keys);

var checkMandatoryInputs = function (request, response, next) {

    if (!request.query.query) {
        response.statusCode = 400;
        response.json({ statusCode: 400, error: "Missing query parameter" })
    }
    else {
        next();
    }
}


var generateResponse = function (request, response) {

//Array for our final response we'll send to the user
var responseObject = [];
//Array for our defered promises
var deferedPromises = [];

    //Create a promise so we can handle the next http calls when this one resolves
            var searchPromise = new Promise(function (resolve) {

                flickr.get("photos.search", { "text": request.query.query, "per_page": 10 }, function (err, result) {
                    if (err) {
                        return response.end(JSON.stringify(err));
                    }
                    for (var i = 0; i < result.photos.photo.length; i++) {
                        responseObject.push({
                            //Id is a place holder so we know how to add the height and width.
                            id: result.photos.photo[i].id,
                            title: result.photos.photo[i].title,
                            //Add place holder url array
                            urls: []
                        })
                    }
                    resolve();
                })
            })

            searchPromise.then(function () {

                //Place Holder Response
                response.json(responseObject);
                //Now we make the other http calls and create the response to send back to the user.

            });

}

router.get('/', [checkMandatoryInputs, generateResponse]);
module.exports = router;