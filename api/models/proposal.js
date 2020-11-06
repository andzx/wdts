const Sequelize = require('sequelize');
const Model = Sequelize.Model;
const Company = require('./company');

class Proposal extends Model {}

Proposal.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    date: Sequelize.DATE,
    time: Sequelize.TIME,
    description: Sequelize.TEXT,
    negotiable: Sequelize.BOOLEAN,
    status: {
        type: Sequelize.ENUM,
        values: ['accepted', 'canceled', 'pending', 'rejected'],
        default: 'pending'
    },
    company_id: {
        type: Sequelize.INTEGER,
        references: {
            model: Company,
            key: 'id'
        }
    },
    job_id: Sequelize.INTEGER
}, {
    sequelize: db,
    modelName: 'proposal'
});

module.exports = Proposal;

/*job_id: {
    type: Sequelize.INTEGER,
    references: {
        model: Job,
        key: 'id'
    }
}*/