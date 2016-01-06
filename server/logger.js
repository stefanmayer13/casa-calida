/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const bunyan = require('bunyan');
module.exports = bunyan.createLogger({
    name: 'CasaCalida',
    level: 'debug',
});
