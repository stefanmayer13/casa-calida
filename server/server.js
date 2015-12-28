/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const Hapi = require('hapi');
const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'homecomfortcli',
    level: 'debug',
});

const routes = require('./routes');
const zwave = require('./zwave/zwave');

const server = new Hapi.Server();
server.connection({ port: 3000 });

routes(server);

server.start((err) => {
    if (err) {
        return log.error('Server did not start');
    }
    log.info('Server running at:', server.info.uri);
});

const processArguments = require('./utils/processArguments');
const username = processArguments.get('username');
const password = processArguments.get('password');
zwave(log, username, password);
