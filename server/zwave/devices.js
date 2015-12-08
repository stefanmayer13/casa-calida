/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('../utils/request');
const url = require('../urls');

module.exports = {
    getDevicesInfo: function getDevicesInfo(state) {
        return request.post(url.devices, null, {
            'Cookie': state.cookie,
        }).then((data) => {
            if (data.statusCode !== 200) {
                throw new Error(`${data.statusCode} ${data.error}`);
            }
            return data.body;
        });
    },
};
