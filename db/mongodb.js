//greate new account works

module.exports = (function initMongoDB() {
    'use strict';

    var mongoose = require('mongoose');
    var Configuration = require('../config.json');
    var out = require('../out');

    var options = {
        db: { native_parser: true },
        server: { poolSize: 5, keepAlive: 1 },
    };
    mongoose.connect(Configuration.mongo.url, options);

    var agentSchema = new mongoose.Schema({
        application: String,
        GAID: String,
        RSAUserName: String,
        socialApp: String, 
        socialAppID: String 
    });

    var Agent = mongoose.model(Configuration.mongo.model, agentSchema);

    return {
        getAgentSchema: function() {
            return customerSchema;
        },

        getAgent: function() {
            return Customer;
        },

        getLinkedAccounts: function(currentRSAUserName, callback) {
            //var linkedRSAIds = [];

            if(currentRSAUserName){
                Agent.find({RSAUserName:currentRSAUserName}).distinct('socialAppID', function(err, socialAppIDs){
                    Agent.find({socialAppID:{$in: socialAppIDs}}).distinct('RSAUserName', function(err, associatedUserNames){
                        callback(associatedUserNames);

                    });
                });   
            }else{
                console.log('userame parameter is not valid', currentRSAUserName);
                callback([]);
            }
        },

        addNewUser: function(application, gaid, rsaUserName, socialApp, socialAppID) {
            var newEntry = {
                application: application,
                GAID: gaid,
                RSAUserName: rsaUserName,
                socialApp: socialApp,
                socialAppID: socialAppID             
            };

            Agent.update({
                RSAUserName: rsaUserName,
                socialApp: socialApp,
                socialAppID: socialAppID
            }, newEntry, {upsert: true}, function newCustomerCallback(err, response){
                if(err) {
                    out.err('Error saving ', response.RSAUserName, ' to mongodb ', err, '\nresponse: ', response);
                } else {
                    out.printDev('Saved ', response.RSAUserName, ' to mongodb ', response);
                }
            })
        }
    }
}());
