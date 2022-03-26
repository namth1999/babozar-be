import {Product} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_product',
        `SELECT * FROM product LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
}


async function create(product : Product) {
    if (!product) {
        throw new Error('Error in creating product. Empty body');
    }

    const values = [Object.values(product)];
    const entries = Object.keys(product);
    let result = await db.query(
        'insert-product',
        format('INSERT INTO product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'product created successfully';
    } else {
        message = 'Error in creating product';
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(products: Product[]) {
    if (!(products && products.length > 0)) {
        throw new Error('Error in creating products. Empty body');
    }

    const values = products.map((p) => {
        p.id = uuidv4();
        return Object.values(p);
    });
    const entries = Object.keys(products[0]);


    let result = await db.query(
        'insert-products',
        format('INSERT INTO product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'Products created successfully';
    } else {
        message = 'Error in creating products';
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
