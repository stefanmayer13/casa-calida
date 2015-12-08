/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
let request = require('superagent'); // eslint-disable-line prefer-const
const Promise = require('bluebird');
const processArguments = require('./processArguments');

const env = processArguments.get('env');
if (!env) {
    console.error('Please provide "env" as an argument'); // eslint-disable-line no-console
    process.exit(-1);
}
const environment = require(`../../environment/${env}`);

const baseUrl = environment.secure ? 'https' : 'http' + `://${environment.server}:${environment.port}`;

function doRequest(method, url, data, headers) {
    return new Promise((resolve, reject) => {
        const req = request[method](baseUrl + url);

        if (headers) {
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
    get: function get(url, headers) {
        return doRequest('get', url, null, headers);
    },

    post: function post(url, data, headers) {
        return doRequest('post', url, data, headers);
    },
};
