/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const authentication = require('./server/zwave/authentication');
const processArguments = require('./server/utils/processArguments');

const username = processArguments.get('username');
const password = processArguments.get('password');

if (!username || !password) {
    console.error('Please provide "username" and "password" as arguments');
    process.exit(-1);
}

authentication.login(username, password).then((cookie) => {
    console.log(cookie);
});
