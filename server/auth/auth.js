/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const uuid = require('node-uuid');
const Boom = require('boom');
const log = require('../logger');
const User = require('../mongodb/User');
const mongodb = require('../utils/MongoDBHelper');

function doLogin(request, username, password) {
    return User.checkAuthentication(username, password)
    .then((user) => {
        const sid = uuid.v4();
        return new Promise((resolve, reject) => {
            request.server.app.cache.set(sid, {user}, 0, (err) => {
                if (err) {
                    log.error();
                    return reject(Boom.badImplementation(err));
                }
                request.cookieAuth.set({sid});
                resolve();
            });
        });
    }, () => {
        throw Boom.unauthorized('Invalid username or password'); //TODO change to support multilanguage
    });
}

function login(request, reply) {
    if (request.auth.isAuthenticated) {
        return reply();
    }

    if (!request.payload.username ||
        !request.payload.password) {

        return reply(Boom.unauthorized('Missing username or password')); //TODO change to support multilanguage
    }
    else {
        doLogin(request, request.payload.username, request.payload.password).then(reply, reply);
    }
};

function register(request, reply) {
    if (request.auth.isAuthenticated) {
        return reply();
    }

    if (!request.payload.username ||
        !request.payload.password) {

        return reply(Boom.unauthorized('Missing username or password')); //TODO change to support multilanguage
    }
    else {
        User.registerUser(request.payload.username, request.payload.password)
            .then(() => doLogin(request, request.payload.username, request.payload.password))
            .then(reply, reply);
    }
};

module.exports = {
    register,
    login,
};
