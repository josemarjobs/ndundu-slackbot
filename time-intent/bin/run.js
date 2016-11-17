'use strict';
require('dotenv').config();
const service = require('../server/service');
const http = require('http');


const server = http.createServer(service);
server.listen(3000);
server.on('listening', () => {
    console.log(`Server listening on ${server.address().port} in ${service.get('env')} mode`);
});