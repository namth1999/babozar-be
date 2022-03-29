import {Shop} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.shop.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_shop)',
            `SELECT * FROM shop LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.shop.getPage, JSON.stringify({
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
        const result = await client.get(environment.redisKeys.shop.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
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
        await client.del(environment.redisKeys.shop.getPage);
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
        await client.del(environment.redisKeys.shop.getPage);
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
