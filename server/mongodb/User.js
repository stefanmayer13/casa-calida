/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */

const Boom = require('boom');
const userCollection = 'users';
const bcrypt = require('bcrypt');
const log = require('../logger');
const mongodb = require('../utils/MongoDBHelper');

module.exports = {
    registerUser(username, password) {
        const db = mongodb.getDb();
        const UserCollection = db.collection(userCollection);
        return new Promise((resolve, reject) => {
            UserCollection.find({
                user: username,
            }).toArray((err, users) => {
                if (err) {
                    log.error(err);
                    return reject(Boom.badImplementation(err));
                }
                if (users.length > 0) {
                    reject(Boom.badRequest('Username already taken')); //TODO change to support multilanguage
                } else {
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            log.error(err);
                            return reject(Boom.badImplementation(err));
                        }
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) {
                                log.error(err);
                                return reject(Boom.badImplementation(err));
                            }
                            UserCollection.insertOne({
                                user: username,
                                password: hash
                            }, (err) => {
                                if (err) {
                                    log.error(err);
                                    return reject(Boom.badImplementation(err));
                                }
                                resolve();
                            });
                        });
                    });
                }
            });
        });
    },

    checkAuthentication(username, password) {
        const db = mongodb.getDb();
        const UserCollection = db.collection(userCollection);
        return new Promise((resolve, reject) => {
            UserCollection.find({
                user: username,
            }).limit(1).next((err, user) => {
                if (err) {
                    log.error(err);
                    return reject(err);
                } else if (!user) {
                    return reject('No user found'); //TODO change to support multilanguage
                }
                bcrypt.compare(password, user.password, (err, res) => {
                    if (err) {
                        log.error(err);
                        return reject(err);
                    } else if (!res) {
                        return reject('Password not equal'); //TODO change to support multilanguage
                    }
                    resolve(user);
                });
            });
        });
    },

    getUserByToken(token) {
        const db = mongodb.getDb();
        const UserCollection = db.collection(userCollection);
        return new Promise((resolve, reject) => {
            UserCollection.find({
                token,
            }).limit(1).next((err, user) => {
                if (err) {
                    log.error(err);
                    return reject(err);
                }
                resolve(user);
            });
        });
    },

    getUserByName(username) {
        const db = mongodb.getDb();
        const UserCollection = db.collection(userCollection);
        return new Promise((resolve, reject) => {
            UserCollection.find({
                user: username,
            }).limit(1).next((err, user) => {
                if (err) {
                    log.error(err);
                    return reject(err);
                }
                resolve(user);
            });
        });
    },
};
