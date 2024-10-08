const { Pool } = require("pg");

const { PG_HOST, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;

module.exports = new Pool({
    host: PG_HOST,
    database: PG_DATABASE,
    user: PG_USER,
    password: PG_PASSWORD,
    port: 5432,
    ssl: { require: true }
});
