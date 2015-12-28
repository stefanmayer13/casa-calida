/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'homecomfortcli' });

const zwave = require('./server/zwave/zwave');
const processArguments = require('./server/utils/processArguments');

const username = processArguments.get('username');
const password = processArguments.get('password');

if (!username || !password) {
    console.error('Please provide "username" and "password" as arguments'); // eslint-disable-line no-console
    process.exit(-1);
}

zwave(log, username, password);
