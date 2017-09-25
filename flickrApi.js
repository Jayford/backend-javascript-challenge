const express = require('express');
const router = express.Router();
const app = express();
const Flickr = require("node-flickr");
const keys = { "api_key": "b8cbe7bed4d17de994ee70f68660be56" }
const flickr = new Flickr(keys);

const checkMandatoryInputs = function (request, response, next) {

    if (!request.query.query) {
        response.statusCode = 400;
        response.json({ statusCode: 400, error: "Missing query parameter" })
    }
    else {
        next();
    }
}

const generateResponse = function (request, response) {

    //Array for our final response we'll send to the user
    let responseObject = [];
    //Array for our promises
    let deferedPromises = [];

    //Create a promise so we can handle the next http calls when this one resolves
    const searchPromise = new Promise(function (resolve) {

        flickr.get("photos.search", { "text": request.query.query, "per_page": 10 }, function (err, result) {
            if (err) {
                return response.end(JSON.stringify(err));
            }
            for (let i = 0; i < result.photos.photo.length; i++) {
                responseObject.push({
                    //Id is a place holder so we know where to add the height and width.
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

        //Now we make the other http calls and create the response to send back to the user.
        responseObject.forEach(function (element) {
            deferedPromises.push(

                new Promise(function (resolve) {

                    flickr.get("photos.getSizes", { "photo_id": element.id }, function (err, result) {

                        if (err) {
                            return response.end(JSON.stringify(err));
                        }
                        else {

                            for (let j = 0; j < result.sizes.size.length; j++) {
                                element.urls.push({
                                    width: result.sizes.size[j].width,
                                    height: result.sizes.size[j].height,
                                    url: result.sizes.size[j].url
                                })
                            }
                        }
                        resolve();

                    })
                })
            )
            //Now we aren't using the id so we can delete it before we return it to the client.
            delete element.id;
        })

        //Execute all the promises. When they are done we'll send it to the client.

        Promise.all(deferedPromises).then(values => {
            response.json(responseObject);
        });

    });
}

router.get('/', [checkMandatoryInputs, generateResponse]);
module.exports = router;