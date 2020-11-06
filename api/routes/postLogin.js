User = require('./../models/user');
User_device = require('./../models/user_device');
Accesstoken = require('./../models/accesstoken');

async function login(username, password, rememberMe, allowMessages = false, allowJobOffers = false) {
    let transaction;
    let ttl = 60 * 60; // 60 minutes login
    
    if (rememberMe) {
        ttl = 60 * 60 * 24 * 30; // 30 days login
    }
    
    try {
        const user = await User.findOne({where: {name: username, password: utils.hash(password)}}, {transaction});

        const accessToken = await Accesstoken.create({
            id: utils.accessToken(),
            ttl: ttl,
            user_id: user.id
        });

        const userDevice = await User_device.create({
            id: utils.deviceToken(),
            active: true,
            user_id: user.id,
            allow_messages: allowMessages,
            allow_job_offers: allowJobOffers
        });
        
        return {
            accessToken: accessToken.id,
            deviceToken: userDevice.id,
            ttl: ttl
        }
    } catch (error) {
        utils.log(error);
        return(null, error);
    }
}

function postLogin(server) {
    server.post('/api/login', function(req, res, next) {
        // See if credentials were sent      
        if (!req.body.username || !req.body.password) {
            res.send(401, {message: 'A username and a password must be provided to login'});
            return next();
        }
        
        // See if the credentials that were provided are valid
        login(req.body.username, req.body.password, req.body.rememberMe).then((credentials, error) => {
            if (error) {
                res.send(500)
                return next();
            }
            
            res.send(200, credentials);
            return next();
        });
    });
};

module.exports = postLogin;