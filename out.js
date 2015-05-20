module.exports = (function initOut() {
    'use strict';
    var Configuration = require('./config');

    return {
        joinArgs: function(args) {
            var arr = [];
            for (var i = 0; i < args.length; i++) {
                arr.push(args[i]);
            }
            return arr.join('');
        },

        print: function() {
            console.log(this.joinArgs(arguments));
        },

        err: function() {
            console.error(this.joinArgs(arguments));
        },

        printDev: function() {
            if(Configuration.dev) {
                this.print(this.joinArgs(arguments));
            }
        },

        printError: function() {
            if(Configuration.dev) {
                this.err(this.joinArgs(arguments));
            }
        }
    }
}());