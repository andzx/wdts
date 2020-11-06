const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class User_role extends Model {}

User_role.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    role: Sequelize.STRING
}, {
    sequelize: db,
    modelName: 'user_role'
});

module.exports = User_role;