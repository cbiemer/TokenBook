var sql = require('mssql'); 
var Configuration = require('../config.json'); 

var config = {
    user: 'TestUser',
    password: 'test123',
    server: 'localhost', // You can use 'localhost\\instance' to connect to named instance 
    database: 'LinkingSocialMediaDB',
}


// exports.getSocialAppQuery = function(socialApp, socialID) {
//             return {
//                 socialApp: socialApp,
//                 socialAppID: socialID
//             };
// }

exports.addNewUser = function(application, gaid, rsaUserName, socialApp, socialAppID) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection);
        request.input('rsaApplication', sql.VarChar, application);
        request.input('gaid', sql.VarChar, gaid);
        request.input('rsaUserName', sql.VarChar, rsaUserName);
        request.input('socialApp', sql.VarChar, socialApp);
        request.input('socialAppID', sql.VarChar, socialAppID);

        request.output('result', sql.VarChar(50));

        request.execute('prc_addNewUser', function(err, returnValue, recordsets) {
            // ... error checks 
            console.log(err);
            console.log(returnValue);
            console.dir(recordsets);
            connection.close();
        });
    });


}

exports.getLinkedAccounts = function(rsaUserName, callback) {
    var connection = new sql.Connection(config, function(err) {
        var request = new sql.Request(connection); // or: var request = connection.request(); 
        request.input('rsaUserName', sql.VarChar, rsaUserName);

        request.execute('prc_getLinkedAccounts', function(err, result, returnValue) {
            // ... error checks 
            //console.log(err);
            //console.log(returnValue);
            connection.close();
            callback(result);
            
        });
    });
            // var linkedRSAIds = [];
            // Agent.find(this.getSocialAppQuery(socialApp, socialID) ,function(err,docResults){
            //     if (err){
            //         console.log('error occured in the query');
            //     }else{

            //         for(var index in docResults){
            //             linkedRSAIds.push(docResults[index].RSAUserName);
            //         }
            //     callback(linkedRSAIds);
            //     }
            // });
}
// var connection = new sql.Connection(config, function(err) {
//     // ... error checks 
//     // Query 
    
//     var request = new sql.Request(connection); // or: var request = connection.request(); 
//     request.query('select * from SocialMediaTable', function(err, recordset) {
//         // ... error checks 
        
//         console.dir(recordset);
//     });
    
//     // Stored Procedure 
    
//     // var request = new sql.Request(connection);
//     // request.input('input_parameter', sql.Int, 10);
//     // request.output('output_parameter', sql.VarChar(50));
//     // request.execute('procedure_name', function(err, recordsets, returnValue) {
//     //     // ... error checks 
        
//     //     console.dir(recordsets);
//     // });
    
// });