const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const User_role = require('./user_role');

class User extends Model {}

User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    active: Sequelize.BOOLEAN,
    profile_pic: Sequelize.STRING,
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    user_role_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User_role,
            key: 'id'
        }
    }
}, {
    sequelize: db,
    modelName: 'user'
});

module.exports = User;