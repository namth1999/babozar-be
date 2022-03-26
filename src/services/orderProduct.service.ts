import {OrderProduct} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_order_product',
        `SELECT * FROM order_product LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
}



async function create(orderProduct: OrderProduct) {
    if (!orderProduct) {
        throw new Error('Error in creating order_product. Empty body');
    }

    const values = [Object.values(orderProduct)];
    const entries = Object.keys(orderProduct);
    let result = await db.query(
        'insert_tag_product',
        format('INSERT INTO order_product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'order_product created successfully';
    } else {
        message = 'Error in creating order_product';
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(ordersProduct: OrderProduct[]) {
    if (!(ordersProduct && ordersProduct.length > 0)) {
        throw new Error('Error in creating tags. Empty body');
    }

    const values = ordersProduct.map((t) => {
        t.id = uuidv4();
        return Object.values(t);
    });
    const entries = Object.keys(ordersProduct[0]);


    let result = await db.query(
        'insert_orders_product',
        format('INSERT INTO order_product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'orders_product created successfully';
    } else {
        message = 'Error in creating orders_product';
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
