const Sequelize = require("sequelize");
const db = new Sequelize(
    't5_6977', // database name
    'root', // database username
    '', // database password
    {
        host: 'localhost', // database host
        port: 3306, // default MySQL port
        dialect: "mysql",
        logging: true,
        timezone: "+07:00",
    }
);
module.exports = {
    initDB: () => {
        return db.authenticate();
    },
    getDB: () => {
        return db;
    },
};