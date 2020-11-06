const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const User = require('./user');

class Company extends Model {}

Company.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    lat: Sequelize.FLOAT,
    lng: Sequelize.FLOAT,
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    logo_image_url: Sequelize.STRING,
    cvr: Sequelize.CHAR(10),
    is_paid: Sequelize.BOOLEAN,
    is_enabled: Sequelize.BOOLEAN,
    is_visible: Sequelize.BOOLEAN
}, {
    sequelize: db,
    modelName: 'company'
});

module.exports = Company;