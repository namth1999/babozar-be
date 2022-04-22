import {Brand} from "../models/models";
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

    const exist = await client.exists(environment.redisKeys.brand.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_brands',
            `SELECT * FROM brand LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.brand.getPage, JSON.stringify({
            data,
            meta
        }));
        await client.expire(environment.redisKeys.brand.getPage, 3600);

        return {
            data,
            meta
        };
    } else {
        const result = await client.get(environment.redisKeys.brand.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}


async function create(brand: Brand) {
    let result = await db.query(
        'insert-brand',
        `INSERT INTO brand VALUES($1,$2,$3) RETURNING *`,
        [uuidv4(), brand.name, brand.slug]);

    let message;

    if (result) {
        message = 'Brand created successfully';
        await client.del(environment.redisKeys.brand.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(brands: Brand[]) {
    const values = brands.map((brand) => {
        brand.id = uuidv4();
        return Object.values(brand);
    });

    let result = await db.query(
        'insert-brands',
        format('INSERT INTO brand (name, slug, id) VALUES %L RETURNING *', values), [])

    let message;

    if (result) {
        message = 'Brands created successfully';
        await client.del(environment.redisKeys.brand.getPage);
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
