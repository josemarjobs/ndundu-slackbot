'use strict';
require('dotenv').config();
const service = require('../server/service');
const http = require('http');


const server = http.createServer(service);
server.listen(process.env.PORT || '3001');
server.on('listening', () => {
    console.log(`Time-Intent listening on ${server.address().port} in ${service.get('env')} mode`);
});
