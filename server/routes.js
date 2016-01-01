/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const zwave = require('./zwave/zwave');

module.exports = function registerRoutes(server) {
    server.route({
        method: 'GET',
        path: '/',
        handler(request, reply) {
            reply('Hello, world!');
        },
    });

    server.route({
        method: 'GET',
        path: '/api/devices',
        handler(request, reply) {
            reply(zwave.getDevices());
        },
    });
};
