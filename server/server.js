/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const Hapi = require('hapi');
const log = require('./logger');

const routes = require('./routes');
const zwave = require('./zwave/zwave');

const server = new Hapi.Server();
server.connection({ port: 3000 });

routes(server);

server.start((err) => {
    if (err) {
        log.error('Server did not start');
        return process.exit(1);
    }
    log.info('Server running at:', server.info.uri);
});

zwave();
