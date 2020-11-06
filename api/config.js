// Server configuration
module.exports = function () {
    this.config = {
        DEBUG_MESSAGES: true, // Shows debug messages in the console
        SECURITY_MESSAGES: true, // Shows security messages in the console
        LOG_TO_DISK: true, // Logs errors
        LOG_PATH: './logs/server.log',
        DB_NAME: 'wdts',
        DB_USER: 'postgres',
        DB_PASSWORD: 'test',
        DB_ADDRESS: 'localhost', // Hostname or ip address
        DB_TYPE: 'postgres',
        API_PORT: 8080,
        API_OTHER_ORIGINS: false,
        API_ACCEPTED_PARSER_TYPES: ['application/json'], // What sort of incoming data the API accepts
    }
}