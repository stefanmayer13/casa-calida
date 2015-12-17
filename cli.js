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

const state = {
    cookie: null,
    log,
};

authentication.login(log, username, password)
.then((cookie) => {
    state.cookie = cookie;
    return devicesApi.getDevicesInfo(state);
}).then((data) => {
    // const controller = data.controller;
    const keys = Object.keys(data.devices);
    const devices = keys.map((key) => {
        return {
            name: data.devices[key].data.givenName.value,
            xml: data.devices[key].data.ZDDXMLFile.value,
            deviceType: data.devices[key].data.deviceTypeString.value,
            isAwake: data.devices[key].data.isAwake.value,
            vendor: data.devices[key].data.vendorString.value,
            temperature: data.devices[key].instances['0'].commandClasses['49'] ? data.devices[key].instances['0'].commandClasses['49'].data['1'].val.value + ' ' + data.devices[key].instances['0'].commandClasses['49'].data['1'].scaleString.value : null,
            battery: data.devices[key].instances['0'].commandClasses['128'] ? data.devices[key].instances['0'].commandClasses['128'].data.last.value : null,
        };
    });
    devices.forEach((device) => {
        console.log(device); // eslint-disable-line no-console
    });

    const xmlRequest = devices.filter((device) => {
        return !!device.xml;
    }).map((device) => {
        return devicesApi.getXml(state, device.xml);
    });

    return Promise.all(xmlRequest);
}).then((data) => {
    data.map((doc) => {
        //console.log(doc.toString());
        console.log(doc.get('deviceDescription'));
        return doc.get('deviceDescription');
    }).forEach((text) => {
        console.log(text);
    });
    //console.log(data);
});
