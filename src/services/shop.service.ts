import {Shop} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_shop)',
        `SELECT * FROM shop LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
}

async function create(shop: Shop) {
    if (!shop) {
        throw new Error('Error in creating product. Empty body');
    }

    const values = [Object.values(shop)];
    const entries = Object.keys(shop);
    let result = await db.query(
        'insert-shop',
        format('INSERT INTO shop (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'shop created successfully';
    } else {
        message = 'Error in creating shop';
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(shops: Shop[]) {
    if (!(shops && shops.length > 0)) {
        throw new Error('Error in creating shops. Empty body');
    }

    const values = shops.map((p) => {
        p.id = uuidv4();
        return Object.values(p);
    });
    const entries = Object.keys(shops[0]);


    let result = await db.query(
        'insert-shops',
        format('INSERT INTO shop (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'shops created successfully';
    } else {
        message = 'Error in creating shops';
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
