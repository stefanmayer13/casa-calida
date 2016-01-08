/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const Config = require('./Config');

module.exports = (server, secret) => {
    server.auth.strategy('session', 'cookie', {
        password: secret,
        cookie: 'casal-calida',
        redirectTo: false,
        isSecure: Config.https,
    });
};
