/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const request = require('../utils/request');
const url = require('urls');

module.exports = {
    login: function login(username, password, rememeberMe = false) {
        return request.post(url.login, {
            login: username,
            password: password,
            keepme: rememeberMe,
        }).then((data) => {
            return data.res.headers['set-cookie'][0];
        });
    },
}
