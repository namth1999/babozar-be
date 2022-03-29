import {Order} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.order.getPage);
    if (!exist) {
        console.log("querry");
        const result = await db.query(
            'fetch_order',
            `SELECT * FROM b_order LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.order.getPage, JSON.stringify({
            data,
            meta
        }), {
            EX: 3600,
            NX: true,
        } );

        return {
            data,
            meta
        };
    } else {
        console.log("cache");
        const result = await client.get(environment.redisKeys.order.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
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
        await client.del(environment.redisKeys.order.getPage);
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
        await client.del(environment.redisKeys.order.getPage);
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
