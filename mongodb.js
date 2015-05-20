//greate new account works

module.exports = (function initMongoDB() {
    'use strict';

    var mongoose = require('mongoose');
    var Configuration = require('./config.json');
    var out = require('./out');

    var options = {
        db: { native_parser: true },
        server: { poolSize: 5, keepAlive: 1 },
    };
    mongoose.connect(Configuration.mongo.url, options);

    var agentSchema = new mongoose.Schema({
        application: String,
        GAID: String,
        RSAUserName: String,
        socialApp: String, //
        socialAppID: String, //
        mobileNumber: String,
        safePasscode: String
    });

    var Agent = mongoose.model(Configuration.mongo.model, agentSchema);

    return {
        getAgentSchema: function() {
            return customerSchema;
        },

        getAgent: function() {
            return Customer;
        },

        getSocialAppQuery: function(socialApp, socialID) {
            return {
                socialApp: socialApp,
                socialAppID: socialID
            };
        },

        getLinkedAccounts: function(socialApp, socialID, callback) {
            var linkedRSAIds = [];
            Agent.find(this.getSocialAppQuery(socialApp, socialID) ,function(err,docResults){
                if (err){
                    console.log('error occured in the query');
                }else{

                    for(var index in docResults){
                        linkedRSAIds.push(docResults[index].RSAUserName);
                    }
                callback(linkedRSAIds);
                }
            });
            
            
        },

        createNewAgent: function(application, gaid, rsaUserName, socialApp, socialAppID, mobileNumber, safePasscode) {
            var agent = new Agent({
                application: application,
                GAID: gaid,
                RSAUserName: rsaUserName,
                socialApp: socialApp,
                socialAppID: socialAppID,
                mobileNumber: mobileNumber,
                safePasscode: safePasscode
            });

            agent.save(function createNewCustomer(err, response){
                if(err) {
                    out.err('Error saving ', response.RSAUserName, ' to mongodb ', err, '\nresponse: ', response);
                } else {
                    out.printDev('Saved ', response.mobileNumber, ' to mongodb ', response);
                }
            })
        }
    }
}());
