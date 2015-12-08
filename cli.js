/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const bunyan = require('bunyan');
const log = bunyan.createLogger({ name: 'homecomfortcli' });

const authentication = require('./server/zwave/authentication');
const devicesApi = require('./server/zwave/devices');
const processArguments = require('./server/utils/processArguments');

const username = processArguments.get('username');
const password = processArguments.get('password');

if (!username || !password) {
    console.error('Please provide "username" and "password" as arguments'); // eslint-disable-line no-console
    process.exit(-1);
}

authentication.login(log, username, password)
.then((cookie) => {
    return devicesApi.getDevicesInfo({
        cookie,
        log,
    });
}).then((data) => {
    // const controller = data.controller;
    const devices = data.devices;
    const keys = Object.keys(devices);
    const names = keys.map((key) => {
        return devices[key].data.givenName.value;
    });
    names.forEach((device) => {
        console.log(device); // eslint-disable-line no-console
    });
});
