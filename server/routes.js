/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

module.exports = function registerRoutes(server) {
    server.route({
        method: 'GET',
        path: '/',
        handler(request, reply) {
            reply('Hello, world!');
        },
    });
};
