import {Address} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.address.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_address',
            `SELECT * FROM address LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.address.getPage, JSON.stringify({
            data,
            meta
        }));
        await client.expire(environment.redisKeys.address.getPage, 60)

        return {
            data,
            meta
        };
    } else {
        const result = await client.get(environment.redisKeys.address.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}

async function create(address: Address) {
    let result = await db.query(
        'insert-address',
        `INSERT INTO address VALUES($1,$2, $3, $4, $5, $6) RETURNING *`,
        [uuidv4(), address.title, address.default, address.lat, address.lng, address.address_formatted]);

    let message;

    if (result) {
        message = 'address created successfully';
        await client.del(environment.redisKeys.address.getPage);
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
        await client.del(environment.redisKeys.address.getPage);
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
