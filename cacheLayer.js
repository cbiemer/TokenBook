var Configuration = require('./config');
var Memcached = require('memcached');
var memcached = new Memcached(Configuration.cache.url);


//var keyExpirationTime = 86400 //seconds
//var baseUrl = 'https://dev.ipipeline.io/user/';

//console.log('mc stats', memcached.stats);
//console.log('mc settings', memcached.settings);
// memcached.stats(function( err, conn ){
//   console.log('mc stats',err);
//   console.log(conn);
// });
// memcached.settings(function( err, conn ){
//   console.log('mc settings',err);
//   console.log(conn);
// });

// memcached.connect( 'localhost:11211', function( err, conn ){
  
//   console.log(err);
//   //console.log(conn);
//   console.log( conn.server );

// });

exports.cacheLinkedAccounts = function(rsaUserName, linkedUsers) {
	var key = Configuration.cache.baseURLKey + rsaUserName;
	memcached.set(key, linkedUsers, Configuration.cache.keyExpirationTime, function (err, result) {
		if(err)
			console.log('error writing to cache: ', err);
		else
			console.log('wrote to cache: ', result);
	});

}

exports.getCachedAccounts = function(rsaUserName, callback) {
	var key = Configuration.cache.baseURLKey + rsaUserName;
	//console.log(key);
	memcached.get(key, function getDataCallback(err, linkedUsers) {
		if(err){
			console.log(err);
		}

		callback(linkedUsers);

	});

exports.flushCache = function () {
	memcached.flush(function (err, result) {
		if(err)
			console.log('error occured flushing cache: ', err);
		else
			console.log('flushed cache: ', result);
	});
}

}