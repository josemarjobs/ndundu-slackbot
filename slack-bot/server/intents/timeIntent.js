'use strict'
const request = require('superagent');
module.exports.process = function (intentData, cb) {
    if (intentData.intent[0].value != 'time') {
        return cb(new Error(`Expected time intent, got ${intentData.intent[0].value}`))
    } 
    if ( !intentData.location) {
        return cb(new Error('Missing location in time intent'));
    }

    const location = intentData.location[0].value.replace(/,.?ndundu/i, '');
    request
        .get(`${process.env.TIMESERVICE_URL}:3001/service/${location}`)
        .end((err, res) => {
            if(err || res.statusCode != 200 || !res.body.result) {
                console.log(err, res)
                return cb(null, `I had a problem getting the time for ${location}.`)
            }
            return cb(null, `In ${location} it's now ${res.body.result}`)
        })

}