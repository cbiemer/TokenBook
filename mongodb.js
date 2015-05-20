module.exports = (function initMongoDB() {
    'use strict';

    var mongoose = require('mongoose');
    var Configuration = require('./config');
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
        socialApp: String,
        socialAppID: String,
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
                    out.err('Error saving ', rsaUserName, ' to mongodb ', err, '\nresponse: ', response);
                } else {
                    out.printDev('Saved ', userPhoneNumber, ' to mongodb ', response);
                }
            })
        }
    }
}());
