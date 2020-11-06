// Import dependencies stuff
require('./config')();
const restify = require('restify');
const Sequelize = require("sequelize");
const Utils = require('./utils');

// Make utilities available throughout the project
global.utils = new Utils();

// Unexpected error logging
process.on('uncaughtException', function (exception) {
    utils.log(exception);
});

// Prevent immediate server exit
process.stdin.resume();

// Handle server exit
function closeServer(options, exitCode) {    
    if (options.cleanup) {
        // Notify of server shut-down
        console.log('\n\x1b[33mServer shutting down\x1b[0m');
        
        // Perform any cleanup operations before server process termination here
    }

    // Exit
    if (options.exit) { 
		process.exit();
    }
}

// Handle server exit, close, crash, etc. events
process.on('exit', closeServer.bind(null, {cleanup:true}));
process.on('SIGINT', closeServer.bind(null, {exit:true}));
process.on('SIGUSR1', closeServer.bind(null, {exit:true}));
process.on('SIGUSR2', closeServer.bind(null, {exit:true}));
process.on('uncaughtException', closeServer.bind(null, {exit:true}));

// Inform about starting the server
console.log('\x1b[33mStarting server\x1b[0m');


// Connect to the database
global.db = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_ADDRESS,
    dialect: config.DB_TYPE,
    define: {
        timestamps: true,
        underscored: true
    }
});

// Get database models
User = require('./models/user');
User_device = require('./models/user_device');
User_role = require('./models/user_role');
Company = require('./models/company');

let server;

// Test database connection
db.authenticate().then(() => {
    console.log('Connected to the database');
    
    // Perform api startup tests
    // console.log("Running tests");
    // Any api tests here
    // ...

    // Start the api server
    server = restify.createServer({
        name: 'wdts',
        version: '0.1.0'
    });

    // Allow requests from other origins
    if (config.API_OTHER_ORIGINS) {
        server.pre((req, res, next) => {
            res.header('Access-Control-Allow-Origin', "*");
            res.header('Access-Control-Allow-Headers', req.header('Access-Control-Request-Headers'));
            // if is preflight(OPTIONS) then response status 204(NO CONTENT)
            if(req.method === 'OPTIONS') {
                return res.send(204);
            }

            return next();
        });
    }

    // Empty body api crash prevention
    server.use(function(req, res, next){
        req.body = {};
        return next();
    });

    // Default of acceptedParserTypes is server.acceptable
    server.use(restify.plugins.acceptParser(config.API_ACCEPTED_PARSER_TYPES));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());

    // Authorization
    server.use(function(req, res, next) {
        //-----------------------------------------------//
        // Routes that are allowed without authorization //
        //-----------------------------------------------//

        // Allow logins without authorization
        if (req.route.method === "POST" && req.route.path === '/api/login') {
            console.log('Request -> ' + req.route.method + ' ' + req.route.path);
            return next();
        }

        //-------------------------------------//
        // Check routes for a valid session id //
        //-------------------------------------//

        // Get client ip and tokens
        if (req.route.path !== '/api/login') {        
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const headerAccessToken = req.header('accessToken') || null;
            const headerDeviceToken = req.header('deviceToken') || null;
            
            // Prevent request execution if one or both of the tokens have not been sent
            if (!headerAccessToken || !headerDeviceToken) {
                res.send(401);
                return next(false);
            }
            
            // See if there is a user with that particular access token
            Accesstoken.findByPk(headerAccessToken).then((accessToken) => {
                if (!accessToken) {
                    res.send(401, {ran: 1});
                    return next(false);
                }
                
                // See if there is a device with that particular device token
                User_device.findByPk(headerDeviceToken).then((user_device) => {
                    if (!user_device) {
                        return next(false);
                    }
                    
                    // Get user id
                    User.findOne({where: {id: user_device.user_id}}).then((user) => {
                        // Pass user details and the new token to the api endpoint
                        req._user = {id: user.id, type: user.type};
                        req._user.newDeviceToken = utils.deviceToken(); // Returned to the user by the endpoint that handles the request
                        
                        // Todo:
                        // Update user_device entry with the new token
                        //
                        
                        // Get user role
                        User_role.findByPk(user.user_role_id).then((user_role) => {
                            if (!user_role) {
                                res.send(500);
                                return next(false);
                            }
                            
                            // Prevent non company users from accesing company related routes
                            if (req.route.path.includes('company') && user_role.role !== 'company') {
                                res.send(401);
                                return next(false);
                            }
                            
                            // Get ids of companies that belong to the user
                            Company.findAll({where: {user_id: user.id}}).then((companies) => {
                                // Remember companies to make sure one companies user cannot access another companies data
                                req._user.companyIds = [];
                                
                                for (let i=0; i < companies.length; i++) {
                                    req._user.companyIds.push(companies[i].id);
                                }

                                return next();
                            });
                        });
                    });
                });
            });
        }
    });

    // API endpoints
    const routes = ['postLogin', 'getJobsProposals'];

    // Import API endpoints
    routes.map((route) => {
        require('./routes/' + route + '.js').call(null, server)
    });

    // Start listening for api calls
    server.listen(config.API_PORT, function () {
        console.log('\x1b[32m\nServer api started\x1b[0m' + '\nAPI Listening on: %s', server.url);
    });
}).catch((error) => {    
    // Log error
    utils.log('Could not connect to the database');
    utils.log(error);
    
    // Stop the server
    process.exit(1);
});