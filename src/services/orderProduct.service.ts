import {OrderProduct} from "../models/models";
import client from "../config/redisCache.config";
import {environment} from "../enviroment";
import HttpException from "../utils/HttpException";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const exist =  await client.exists(environment.redisKeys.orderProduct.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_order_product',
            `SELECT * FROM order_product LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.orderProduct.getPage, JSON.stringify({
            data,
        }));
        await client.expire(environment.redisKeys.orderProduct.getPage, 60);

        return {
            data,
            meta
        };
    } else {
        const result = await client.get(environment.redisKeys.orderProduct.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
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
        await client.del(environment.redisKeys.orderProduct.getPage);
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
        await client.del(environment.redisKeys.orderProduct.getPage);
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
