/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const xml2js = require('xml2js');
const parser = new xml2js.Parser();
const request = require('../utils/request');
const url = require('../urls');

module.exports = {
    getDevicesInfo(state) {
        return request.post(url.data + '0', null, {
            'Cookie': state.cookie,
        }).then((data) => {
            if (data.statusCode !== 200) {
                throw new Error(`${data.statusCode} ${data.error}`);
            }
            return data.body;
        });
    },

    getXml(state, file) {
        return request.get(`${url.xml}/${file}`, null, {
            'Cookie': state.cookie,
        }).then((data) => {
            if (data.statusCode !== 200) {
                throw new Error(`${data.statusCode} ${data.error}`);
            }

            return new Promise((resolve, reject) => {
                parser.parseString(data.text, (err, xmlObject) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve({
                        xml: file,
                        object: xmlObject,
                    });
                });
            });
        });
    },

    getIncrementalUpdate(state, lastUpdate) {
        return request.post(url.data + lastUpdate, null, {
            'Cookie': state.cookie,
        }).then((data) => {
            if (data.statusCode !== 200) {
                throw new Error(`${data.statusCode} ${data.error}`);
            }
            return data.body;
        });
    },
};
