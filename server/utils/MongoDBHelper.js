/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;

let activeDb = null;

module.exports = {
    connect() {
        const mongoIp = process.env.MONGO_PORT_27017_TCP_ADDR || 'localhost';
        const mongoPort = process.env.MONGO_PORT_27017_TCP_PORT || '27017'
        const url = `mongodb://${mongoIp}:${mongoPort}/casacalida`;
        return new Promise((resolve, reject) => {
            MongoClient.connect(url, (err, db) => {
                if (err) {
                    return reject(err);
                }
                activeDb = db;
                resolve(db);
            });
        });
    },

    getDb() {
        return activeDb;
    }
};
