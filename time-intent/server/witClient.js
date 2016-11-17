'use strict';
var request = require('superagent');
var util = require('util')
function handleWitResponse (res) {
    return res.entities;
}

module.exports = function (token) {
    const ask = function (message, cb) {
        request
            .get(process.env.WIT_ENDPOINT)
            .set('Authorization', 'Bearer '+token)
            .query({v: process.env.WIT_ENDPOINT_V})
            .query({q: message})
            .end((err, res) => {
                if (err) return cb(err)

                if(res.statusCode != 200) {
                    return cb('Expected status 200 but got '+res.statusCode)
                }
                const witResponse = handleWitResponse(res.body);
                return cb(null, witResponse)
            })
    }
    return {
        ask
    }
}