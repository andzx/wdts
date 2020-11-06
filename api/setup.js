require('./config')();
const Sequelize = require('sequelize');
const Utils = require('./utils');

// Initialize utils and db
global.utils = new Utils();
global.db = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DB_ADDRESS,
    dialect: config.DB_TYPE,
    define: {
        timestamps: true,
        underscored: true
    }
});

// Import table models
const Accesstoken = require('./models/accesstoken');
const User = require('./models/user');
const User_role = require('./models/user_role');
const User_device = require('./models/user_device');
const Company = require('./models/company');
const Proposal = require('./models/proposal');

// Test the transaction stuff, if it works at all
insertDummyData().catch(error => console.log(error.stack));
let transaction;

async function insertDummyData() {
  try {
    // get transaction
    transaction = await db.transaction();

    // Add db data
    const role1 = await User_role.create({role: 'company'}, {transaction});
    const role2 = await User_role.create({role: 'private'}, {transaction});
    
    // Populate database with mock data
    const user1 = await User.create({
        active: true,
        profile_pic: './public/profile_pics/user1.jpg',
        name: 'Jonathan',
        email: 'jonathan.miles@gmail.com',
        user_role_id: role1.id,
        password: utils.hash('password'),
        phone_numer: '004527992798',
        address: 'Some street 27',
        zip_code: '2900',
        city: 'Hellerup'
    }, {transaction});
    
    const user2 = await User.create({
        active: true,
        profile_pic: './public/profile_pics/user2.jpg',
        name: 'Jeniffer',
        email: 'jeniffer.smith@gmail.com',
        user_role_id: role2.id,
        password: utils.hash('password'),
        phone_numer: '004527992799',
        address: 'Some street 77',
        zip_code: '2920',
        city: 'Skovshoved'
    }, {transaction});
    
    const company1 = await Company.create({
        name: 'Jonathan\'s Boats',
        lat: 55.731568,
        lng: 12.581888,
        user_id: user1.id,
        logo_image_url: 'https://www.jonathans-boats.dk/logo.png',
        cvr: '00000001',
        is_paid: true,
        is_enabled: true,
        is_visible: true
    }, {transaction});
    
    for (let i = 0; i < 25; i++) {
        let proposal = await Proposal.create({
            message: 'Will paint the whole deck for DKK' + (700 + i),
            time: '11:00',
            description: 'Some description here ' + i,
            negotiable: true,
            company_id: company1.id,
            job_id: 1
        }, {transaction});
    }

    // Commit
    transaction.commit().then(() => {
        console.log('\x1b[32mThe API is ready for use\x1b[0m');
        db.close();
    });
  } catch (err) {
    // Rollback transaction if any errors were encountered
    await transaction.rollback();
  }
}

// See if a connection was made
console.log('\x1b[33mChecking connection\x1b[0m');
db.authenticate().then(() => {
    console.log('\x1b[32mConnected to database\x1b[0m');

    // Sync tables with database
    console.log('\x1b[33mSyncing models with database\x1b[0m');
    db.sync().then(() => {
        console.log('\x1b[32mModels synced\x1b[0m');
        console.log('\x1b[33mPopulating database with dummy data\x1b[0m');
        insertDummyData();
    });
}).catch((error) => {    
    console.log('Could not connect to the database');
    console.log(error);
});