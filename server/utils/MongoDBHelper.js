/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

module.exports = {
    connect() {
        const url = 'mongodb://localhost:27017/homecomfort';
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, function (err, db) {
                if (err) {
                    return reject(err);
                }
                resolve(db);
            });
        });
    },

    setDevice(db, device) {
        const collection = db.collection('devices');
        const writes = device.sensors.map((sensor) => {
            return this.updateSensorData(db, device._id, sensor);
        });
        device.sensors = device.sensors.map((sensor) => {
            const keys = Object.keys(sensor);
            const mappedSensor = keys
                .filter((key) => {
                    return key !== 'value' && key !== 'lastUpdate';
                })
                .reduce((prev, key) => {
                    prev[key] = sensor[key];
                    return prev;
                }, {});
            return mappedSensor;
        });
        writes.push(
            new Promise((resolve, reject) => {
                collection.updateOne({
                    _id: device._id,
                }, {
                    $set: device,
                }, {
                    upsert: true,
                }, (err, result) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve(result);
                });
            })
        );
        return Promise.all(writes);
    },

    getDeviceData(db, id) {
        const collection = db.collection('devices');
        return new Promise((resolve, reject) => {
            collection.find({
                _id: id,
            }).limit(1).next((err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },

    updateSensorData(db, deviceId, sensor) {
        const collection = db.collection('sensors');
        const key = `${deviceId}.${sensor.commandClass}.${sensor.key}`;
        return new Promise((resolve, reject) => {
            collection.insertOne({
                sensor: key,
                value: sensor.value,
                lastUpdate: sensor.lastUpdate,
            }, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result);
            });
        });
    },
};
