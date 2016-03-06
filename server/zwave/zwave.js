/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const log = require('../logger');
const mongodb = require('../utils/MongoDBHelper');
const User = require('../mongodb/User');
const mongodbZwave = require('../mongodb/Zwave');

function checkDb() {
    if (!mongodb.getDb()) {
        const error = new Error('Database not initialized');
        log.error(error);
        throw error;
    }
}

module.exports = function init() {
    return mongodb.connect()
        .then((db) => {
            log.debug('Connected to mongodb');
        }).catch((e) => {
            log.fatal(e);
            mongodb.getDb().close((err) => {
                if (err) {
                    log.error(err);
                }
                throw e;
            });
        });
};

module.exports.getDevices = function getDevices() {
    checkDb();
    return User.getUserByName('smayer').then((user) => {
        if (!user) {
            return Promise.reject('TODO remove');
        }
        return mongodbZwave.getDevices(user)
            .catch((e) => {
                log.error(e);
                throw e;
            });
    });
};

module.exports.getUser = function getUser(token) {
    checkDb();
    return User.getUserByToken(token)
        .catch((e) => {
            log.error(e);
            throw e;
        });
};

module.exports.fullUpdate = function fullUpdate(user, devices) {
    log.debug(`Received full update from ${user.user}`);
    checkDb();
    return Promise.all(devices
        .map((device) => mongodbZwave.setDevice(user, device)
            .then((ret) => {
                if (ret.upsertedCount === 1) {
                    log.debug(`Added device ${device._id}`);
                } else if (ret.modifiedCount === 1) {
                    log.debug(`Updated device ${device._id}`);
                }
            })
    )).catch((e) => {
        log.error(e);
        throw e;
    });
};

module.exports.incrementalUpdate = function incrementalUpdate(user, sensors) {
    log.debug(`Received incremental update from ${user.user}`);
    checkDb();
    return Promise.all(sensors
        .map((sensor) => mongodbZwave.updateSensorData(user, sensor.deviceId, sensor.sensor)))
    .catch((e) => {
        log.error(e);
        throw e;
    });
};
