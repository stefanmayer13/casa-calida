/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const uuid = require('node-uuid');
const Boom = require('boom');
const log = require('../logger');
const User = require('../mongodb/User');

module.exports = function login(request, reply) {
    if (request.auth.isAuthenticated) {
        return reply();
    }

    if (!request.payload.username ||
        !request.payload.password) {

        return reply(Boom.unauthorized('Missing username or password')); //TODO change to support multilanguage
    }
    else {
        User.checkAuthentication().then((user) => {
            const sid = uuid.v4();
            request.server.app.cache.set(sid, { user }, 0, (err) => {
                if (err) {
                    log.error();
                    reply(Boom.badImplementation(err));
                }

                request.cookieAuth.set({ sid });
                return reply();
            });
        }, () => reply(Boom.unauthorized('Invalid username or password'))); //TODO change to support multilanguage
    }
};
