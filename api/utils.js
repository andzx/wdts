require("./config.js");
const fs = require('fs');
const crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');

class Utils {    
    constructor(debugMessages = config.DEBUG_MESSAGES, logToDisk = config.LOG_TO_DISK, logPath = config.LOG_PATH) {
        this.debugMessages = debugMessages;
        this.logToDisk = logToDisk;
        this.logPath = logPath;
        this.stream = fs.createWriteStream(logPath, {flags:'a'});
    }
    
    _dateTimeNow() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];
        const date = new Date();
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const dayOfTheMonth = date.getDate();
        let hours = date.getHours(); if (hours < 10) { hours = '0' + hours}
        let minutes = date.getMinutes(); if (minutes < 10) { minutes = '0' + minutes}
        let seconds = date.getSeconds(); if (seconds < 10) { seconds = '0' + seconds}
        return '[' + month + '-' + dayOfTheMonth + '-' + year + ' ' + hours + ':' + minutes + ':' + seconds + ']';
    }

    log(message) {    
        // Check if message is a message or a stack trace
        if (message.stack) {
            message = message.stack;
        }
    
        if (config.DEBUG_MESSAGES) {
            console.log('Debug said:\x1b[36m ' + message + '\x1b[0m');
        }

        if (config.LOG_TO_DISK) {
            try {
                this.stream.write(this._dateTimeNow() + message + '\r\n');
            } catch(e) {
                console.log("Could not write to server log, error: " + e);
            }
        }
    }
    
    securityLog(message) {
        if (config.SECURITY_MESSAGES) {
            console.log('Security said:\x1b[91m ' + message + '\x1b[0m');
        }

        try {
            this.stream.write(this._dateTimeNow() + message + '\r\n');
        } catch(e) {
            console.log("Could not write to security log, error: " + e);
        }
    }
    
    hash(input, hashType = 'sha256') {
        return crypto.createHash(hashType).update(input).digest("hex");
    }
    
    accessToken() {
        return cryptoRandomString({length: 256, type: 'alphanumeric'});
    }
    
    deviceToken() {
        return cryptoRandomString({length: 256, type: 'alphanumeric'});
    }
}

module.exports = Utils;