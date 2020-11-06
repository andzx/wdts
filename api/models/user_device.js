const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const User = require('./user');

class User_device extends Model {}

User_device.init({
    id: {
        type: Sequelize.TEXT,
        primaryKey: true
    },
    active: Sequelize.BOOLEAN,
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    allow_messages: Sequelize.BOOLEAN,
    allow_job_offers: Sequelize.BOOLEAN
}, {
    sequelize: db,
    modelName: 'user_device'
});

User_device.belongsTo(User);

module.exports = User_device;