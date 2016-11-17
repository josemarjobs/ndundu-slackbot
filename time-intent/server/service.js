'use strict';

const express = require('express');
const request = require('superagent');
const moment = require('moment');
const service = express();


service.get('/service/:location', (req, res) => {
    var geocodingUrl = process.env.GOOGLE_GEOCODING_URL;
    geocodingUrl += '?address='+req.params.location;
    geocodingUrl += '&key='+process.env.GOOGLE_GEOCODING_API_KEY;
    request.get(geocodingUrl).end((err, response) => {
        if (err) {
            console.log(err)
            return res.sendStatus(500);
        }
        const loc = response.body.results[0].geometry.location;
        const timestamp = +moment().format('X');
        var timezoneUrl = process.env.GOOGLE_TIMEZONE_URL;
        timezoneUrl += `?location=${loc.lat},${loc.lng}`;
        timezoneUrl += '&timestamp='+timestamp;
        timezoneUrl += '&key=' + process.env.GOOGLE_TIMEZONE_API_KEY;
        request.get(timezoneUrl).end((err, response) => {
            if (err) {
               console.log(err)
                return res.sendStatus(500);
            }   
            const result = response.body;
            const timeString = moment
                .unix(timestamp+result.dstOffset+result.rawOffset)
                .utc()
                .format('dddd, MMMM Do YYYY, h:mm:ss a')
            res.json({result: timeString});
        })
    })
})

module.exports = service;