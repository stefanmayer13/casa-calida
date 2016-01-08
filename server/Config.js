/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

let env;

switch (process.env.NODE_ENV) {
    case 'production':
        env = 'production';
        break;
    default:
        env = 'dev';
}

module.exports = require('../config/' + env + '/server');
