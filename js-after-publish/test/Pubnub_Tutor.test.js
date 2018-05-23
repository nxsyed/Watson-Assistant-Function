const assert = require('chai').assert;
const expect = require('chai').expect;
const mock = require('pubnub-functions-mock');

const requestObject = {
  'method': 'publish',
  'meta': {},
  'params': {},
  'uri': '',
  'channels': [],
  'callback': '0',
  'message': {},
  'ok': function (){
    return new Promise((resolve) => {
      resolve(requestObject);
    });
  },
  'abort': function (){
    return new Promise((resolve, reject) => {
      reject(requestObject);
    });
  },
};

describe('#eventhandler', () => {
  let eventhandler;

  beforeEach(() => {
    eventhandler = mock('js-after-publish/Pubnub_Tutor.js');
  });

  it('creates event handler of type Function', function(done) {
    assert.isFunction(eventhandler, 'was successfully created');
    done();
  });

  // // Write another test!
  // it('test', (done) => {
  //   let request = Object.assign({}, requestObject);

  //   eventhandler(request).then((testResult) => {
  //     assert.equal(testResult.message.hello, 'hello!');
  //     done();
  //   });
  // });
});