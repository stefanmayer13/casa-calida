/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const bunyan = require('bunyan');
module.exports = bunyan.createLogger({
    name: 'CasaCalida',
    level: 'debug',
});
