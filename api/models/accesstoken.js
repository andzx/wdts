const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const User = require('./user');

class Accesstoken extends Model {}

Accesstoken.init({
    id: {
        type: Sequelize.TEXT,
        primaryKey: true
    },
    ttl: Sequelize.INTEGER,
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    }
}, {
    sequelize: db,
    modelName: 'accesstoken'
});

module.exports = Accesstoken;