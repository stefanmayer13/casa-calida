/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

function getSensorId(deviceId, sensor) {
    return `${deviceId}.${sensor.commandClass}.${sensor.key}`;
}

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

    getDevices(db) {
        const DeviceCollection = db.collection('devices');
        const sensorCollection = db.collection('sensors');
        return new Promise((resolve, reject) => {
            DeviceCollection.find({}).toArray((err, result) => {
                if (err) {
                    return reject(err);
                }
                const promises = result.map((device) => {
                    return device.sensors.map((sensor) => {
                        return new Promise((resolve2, reject2) => {
                            const key = getSensorId(device._id, sensor);
                            sensorCollection.find({
                                sensor: key,
                            }, {
                                sort: {
                                    lastUpdate: -1,
                                },
                            }).limit(1).next((err2, sensorData) => {
                                if (err2) {
                                    return reject2(err2);
                                }
                                resolve2(sensorData);
                            });
                        }).then((sensorData) => {
                            sensor.value = sensorData.value;
                        });
                    });
                });
                Promise.all([].concat.apply([], promises)).then(() => {
                    resolve(result);
                });
            });
        });
    },

    updateSensorData(db, deviceId, sensor) {
        const collection = db.collection('sensors');
        const key = getSensorId(deviceId, sensor);
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
