/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const zwave = require('./zwave/zwave');
const Boom = require('boom');

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
        path: '/{data}',
        config: {
            auth: {
                strategy: 'session',
                scope: 'user',
            },
            handler(request, reply) {
                reply('Hello, world!');
            },
        },
    });

    server.route({
        method: 'GET',
        path: '/api/v1/devices',
        handler(request, reply) {
            zwave.getDevices().then(reply).catch(reply);
        },
    });

    server.route({
        method: 'GET',
        path: '/api/v1/check',
        handler(request, reply) {
            zwave.getUser(request.headers.token).then((user) => {
                if (user) {
                    reply('ok');
                } else {
                    reply(Boom.unauthorized('invalid token'));
                }
            }).catch(reply);
        },
    });

    server.route({
        method: 'POST',
        path: '/api/v1/fullupdate',
        handler(request, reply) {
            zwave.getUser(request.headers.token)
                .then((user) => {
                    return zwave.fullUpdate(user, request.payload);
                }).then(reply).catch(reply);
        },
    });

    server.route({
        method: 'POST',
        path: '/api/v1/incrementalupdate',
        handler(request, reply) {
            zwave.getUser(request.headers.token)
                .then((user) => {
                    return zwave.incrementalUpdate(user, request.payload);
                }).then(reply).catch(reply);
        },
    });
};
