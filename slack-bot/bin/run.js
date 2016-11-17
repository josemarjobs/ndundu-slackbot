'use strict';
require('dotenv').config();
const slackClient = require('../server/slackClient');
const service = require('../server/service');
const http = require('http');

const witToken = process.env.WIT_TOKEN;
const witClient = require('../server/witClient')(witToken);

const slackToken = process.env.SLACK_RTM_TOKEN;
const slackLogLevel = process.env.SLACK_LOG_LEVEL
const rtm = slackClient.init(slackToken, slackLogLevel, witClient);
rtm.start();


const server = http.createServer(service);
slackClient.addAuthenticatedHandler(rtm, () => server.listen(3000));

server.on('listening', () => {
    console.log(`Server listening on ${server.address().port} in ${service.get('env')} mode`);
});
