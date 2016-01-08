/**
 * @author <a href="mailto:stefan@stefanmayer.me">Stefan Mayer</a>
 */
const chai = require('chai');
const sinon = require('sinon');
const rewire = require('rewire');
const expect = chai.expect;

const request = rewire('../../utils/request.js');

const requestMock = {
    get: sinon.stub(),
    post: sinon.stub(),
    set: sinon.spy(),
    send: sinon.spy(),
    end: sinon.stub(),
};
requestMock.get.returns(requestMock);
requestMock.post.returns(requestMock);
request.__set__('request', requestMock);

describe('request', () => {
    beforeEach(() => {
        requestMock.end.callsArg(0);

        requestMock.get.reset();
        requestMock.post.reset();
        requestMock.set.reset();
        requestMock.send.reset();
    });

    describe('get', () => {
        it('should return a promise', () => {
            const promise = request.get('url');

            expect(promise.then).to.be.a.function;

            return promise;
        });

        it('should call the get method of superagent', () => {
            const promise = request.get('url');

            expect(requestMock.get.callCount).to.be.equal(1);

            return promise;
        });

        it('should set the provided url', () => {
            const url = '/test';
            const promise = request.get(url);

            expect(requestMock.get.getCall(0).args[0]).to.be.equal(url);

            return promise;
        });

        it('should set the provided headers', () => {
            const headers = {
                'Cookie': 'abc',
                'Content-Type': 'application/json',
            };
            const promise = request.get('url', headers);

            expect(requestMock.set.callCount).to.be.equal(2);
            expect(requestMock.set.getCall(0).args).to.deep.equal(['Cookie', headers.Cookie]);
            expect(requestMock.set.getCall(1).args).to.deep.equal(['Content-Type', headers['Content-Type']]);

            return promise;
        });

        it('should resolve with the data', () => {
            const mockData = {
                a: 'b',
            };
            requestMock.end.callsArgWith(0, null, mockData);

            const promise = request.get('url');

            return promise.then((data) => {
                expect(data).to.be.equal(mockData);
            }, () => {
                expect(true).to.be.false;
            });
        });

        it('should reject promise on error', () => {
            const mockError = new Error('error');
            requestMock.end.callsArgWith(0, mockError);

            const promise = request.get('url');

            return promise.then(() => {
                expect(true).to.be.false;
            }, (error) => {
                expect(error).to.be.equal(mockError);
            });
        });
    });

    describe('post', () => {
        it('should return a promise', () => {
            const promise = request.post('url');

            expect(promise.then).to.be.a.function;

            return promise;
        });

        it('should call the post method of superagent', () => {
            const promise = request.post('url');

            expect(requestMock.post.callCount).to.be.equal(1);

            return promise;
        });

        it('should set the provided url', () => {
            const url = '/test';
            const promise = request.post(url);

            expect(requestMock.post.getCall(0).args[0]).to.be.equal(url);

            return promise;
        });

        it('should set the provided data', () => {
            const data = {
                a: 'b',
            };
            const promise = request.post('url', data);

            expect(requestMock.send.callCount).to.be.equal(1);
            expect(requestMock.send.getCall(0).args[0]).to.be.equal(data);

            return promise;
        });

        it('should set the provided headers', () => {
            const headers = {
                'Cookie': 'abc',
                'Content-Type': 'application/json',
            };
            const promise = request.post('url', {}, headers);

            expect(requestMock.set.callCount).to.be.equal(2);
            expect(requestMock.set.getCall(0).args).to.deep.equal(['Cookie', headers.Cookie]);
            expect(requestMock.set.getCall(1).args).to.deep.equal(['Content-Type', headers['Content-Type']]);

            return promise;
        });

        it('should resolve with the data', () => {
            const mockData = {
                a: 'b',
            };
            requestMock.end.callsArgWith(0, null, mockData);

            const promise = request.post('url');

            return promise.then((data) => {
                expect(data).to.be.equal(mockData);
            }, () => {
                expect(true).to.be.false;
            });
        });

        it('should reject promise on error', () => {
            const mockError = new Error('error');
            requestMock.end.callsArgWith(0, mockError);

            const promise = request.post('url');

            return promise.then(() => {
                expect(true).to.be.false;
            }, (error) => {
                expect(error).to.be.equal(mockError);
            });
        });
    });
});
