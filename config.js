const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    host :process.env.HOST_DB,
    db_user: process.env.USER_DB,
    db_password: process.env.PASSWORD_DB
}