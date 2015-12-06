/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
let request = require('superagent'); // eslint-disable-line prefer-const
const Promise = require('bluebird');

function doRequest(method, url, data, headers) {
    return new Promise((resolve, reject) => {
        const req = request[method](url);

        if (headers && headers.length > 0) {
            const headerKeys = Object.keys(headers);
            headerKeys.forEach((key) => {
                req.set(key, headers[key]);
            });
        }

        if (data) {
            req.send(data);
        }

        req.end((err, requestedData) => {
            if (err) {
                return reject(err);
            }
            return resolve(requestedData);
        });
    });
}

module.exports = {
    get: function get(method, url, headers) {
        return doRequest('get', url, null, headers);
    },

    post: function post(method, url, data, headers) {
        return doRequest('post', url, data, headers);
    },
};
