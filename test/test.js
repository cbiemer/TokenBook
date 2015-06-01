var cacheLayer = require('../cacheLayer.js');
var mongodb = require('../db/mongodb.js');

var assert = require("assert")


describe('cacheLayer', function(){
  describe('#getCachedAccounts()', function(){
    it('returns undefined if given unknown key', function(done){
      cacheLayer.getCachedAccounts('FalseName', function (result) {
      	assert.equal(result, undefined);

      	cacheLayer.getCachedAccounts('harry123', function (result) {
      		assert.equal(result, undefined);
      		done();
      	});
      });
    });
  });
});

describe('mongodb', function(){
  describe('#getLinkedAccounts()', function(){
    it('return empty list if no records found', function(done){
      mongodb.getLinkedAccounts('FalseName', function (result) {
        //console.log(result);
        assert(Array.isArray(result));

        mongodb.getLinkedAccounts(null, function (result) {
          assert(Array.isArray(result));

          mongodb.getLinkedAccounts('hgott123', function (result) {
            console.log(result);
            assert.notEqual(result, undefined);
            done();  
          });
        });
      });
    });
  });
});
