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
        return new Promise((resolve, reject) => {
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
        });
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
};
