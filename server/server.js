/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const Hapi = require('hapi');
const HapiAuthCookie = require('hapi-auth-cookie');
const Inert = require('inert');
const log = require('./logger');

const sessionSecret = process.env.NODE_SESSION_SECRET;

if (!sessionSecret) {
    log.error('Please provide a sesson secret. See README for more infos.');
    process.exit(1);
}

const routes = require('./routes');
const zwave = require('./zwave/zwave');

const server = new Hapi.Server();
server.connection({ port: 3000 });

zwave().then(() => {
    log.debug('Registering plugins');
    const plugins = [HapiAuthCookie, Inert];

    server.register(plugins, (err) => {
        if (err) {
            log.error(err);
            return;
        }

        require('./AuthScheme')(server, sessionSecret);
        routes(server);

        server.start((error) => {
            if (error) {
                log.error('Server did not start', error);
                return process.exit(1);
            }
            log.info('Server running at:', server.info.uri);
        });
    });
}).catch((e) => {
    log.error(e);
});
