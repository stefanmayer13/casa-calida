/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const Config = require('./Config');

module.exports = (server, secret) => {
    const cache = server.cache({ segment: 'sessions', expiresIn: 3 * 24 * 60 * 60 * 1000 });
    server.app.cache = cache;
    server.auth.strategy('session', 'cookie', true, {
        password: secret,
        cookie: 'casal-calida',
        redirectTo: false,
        isSecure: Config.https,
        validateFunc(request, session, callback) {
            cache.get(session.sid, (err, cached) => {
                if (err) {
                    return callback(err, false);
                }

                if (!cached) {
                    return callback(null, false);
                }

                return callback(null, true, cached.account);
            });
        }
    });
};
