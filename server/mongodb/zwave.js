/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const mongodb = require('../utils/MongoDBHelper');

function getDeviceId(user, deviceId) {
    return `${user._id}/${deviceId}`;
}

function getSensorId(deviceId, sensor) {
    return `${deviceId}.${sensor.commandClass}.${sensor.key}`;
}

module.exports = {
    setDevice(user, device) {
        const db = mongodb.getDb();
        const collection = db.collection('devices');

        device._id = getDeviceId(user, device.deviceId);
        device.user = user._id;
        const writes = device.sensors
            .map((sensor) => this.updateSensorData(db, user, device.deviceId, sensor));
        device.sensors = device.sensors.map((sensor) => {
            const keys = Object.keys(sensor);
            const mappedSensor = keys
                .filter((key) => key !== 'value' && key !== 'lastUpdate')
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

    getDevices(user) {
        const db = mongodb.getDb();
        const DeviceCollection = db.collection('devices');
        const sensorCollection = db.collection('sensors');
        return new Promise((resolve, reject) => {
            DeviceCollection.find({
                user: user._id,
            }).toArray((err, result) => {
                if (err) {
                    return reject(err);
                }
                const promises = result
                    .map((device) => device.sensors
                        .map((sensor) => new Promise((resolve2, reject2) => {
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
                                if (sensorData) {
                                    sensor.value = sensorData.value;
                                    sensor.lastUpdate = sensorData.lastUpdate;
                                }
                            })
                        )
                    );
                Promise.all([].concat.apply([], promises)).then(() => {
                    resolve(result);
                }).catch((e) => {
                    reject(e);
                });
            });
        });
    },

    updateSensorData(user, deviceId, sensor) {
        const db = mongodb.getDb();
        const collection = db.collection('sensors');
        const dbDeviceId = getDeviceId(user, deviceId);
        const key = getSensorId(dbDeviceId, sensor);
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
}