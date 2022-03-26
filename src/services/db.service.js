const dbConfig = require('../config/db.config');

const {Pool} = require('pg');
const pool = new Pool(dbConfig.options);
async function query(name, sql, params) {
    let result;
    const client = await pool.connect();
    await client.query(`SET schema '${dbConfig.schemaName}'`);
    try {
        const queryText = {
            // give the query a unique name
            name: name,
            text: sql,
            values: params
        };
        await client.query('BEGIN');
        result = await client.query(queryText);
        await client.query('COMMIT');
    } catch (e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
    return result;
}

module.exports = {
    query
}
