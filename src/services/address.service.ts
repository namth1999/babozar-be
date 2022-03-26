import {Address} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_address',
        `SELECT * FROM address LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
}



async function create(address: Address) {
    let result = await db.query(
        'insert-address',
        `INSERT INTO address VALUES($1,$2, $3, $4, $5, $6) RETURNING *`,
        [uuidv4(), address.title, address.default, address.lat, address.lng, address.address_formatted]);

    let message;

    if (result) {
        message = 'address created successfully';
    } else {
        message = 'Error in creating address';
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(addresses: Address[]) {
    if (!(addresses && addresses.length > 0)) {
        return {
            message: 'Error in creating addresses. Empty body',
            data: [],
        };
    }

    const values = addresses.map((address) => {
        address.id = uuidv4();
        return Object.values(address);
    });
    const entries = Object.keys(addresses[0]);


    let result = await db.query(
        'insert-addresses',
        format('INSERT INTO address (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
        )

    let message;

    if (result && result.rows.length > 0) {
        message = 'addresses created successfully';
    } else {
        message = 'Error in creating addresses';
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}


module.exports = {
    getPage,
    create,
    createMultiple,
}
