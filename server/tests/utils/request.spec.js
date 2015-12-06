/**
 * @author <a href="mailto:stefanmayer13@gmail.com">Stefan Mayer</a>
 */
const chai = require('chai');
const rewire = require('rewire');
const expect = chai.expect;

const request = rewire('../../utils/request.js');

const requestMock = {
    get: () => {
        return requestMock;
    },
    end: (cb) => {
        cb();
    },
};
request.__set__('request', requestMock);

describe('request', () => {
    describe('get', () => {
        it('should return a promise', () => {
            const promise = request.get('url');

            expect(promise.then).to.be.a.function;

            return promise;
        });
    });
});
