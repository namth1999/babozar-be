import {Order} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_order',
        `SELECT * FROM b_order LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
}



async function create(order: Order) {
    if (!order) {
        throw new Error('Error in creating order. Empty body');
    }

    order.id = uuidv4();
    const values = [Object.values(order)];

    const entries = Object.keys(order);
    console.log( format('INSERT INTO order (%s) VALUES %L RETURNING *',entries.toString(), values))
    let result = await db.query(
        'insert-order',
        format('INSERT INTO b_order (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'order created successfully';
    } else {
        message = 'Error in creating order';
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(orders: Order[]) {
    if (!(orders && orders.length > 0)) {
        throw new Error('Error in creating orders. Empty body');
    }

    const values = orders.map((o) => {
        o.id = uuidv4();
        return Object.values(o);
    });
    const entries = Object.keys(orders[0]);

    let result = await db.query(
        'insert-orders',
        format('INSERT INTO b_order (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'orders created successfully';
    } else {
        message = 'Error in creating orders';
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
