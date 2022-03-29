import {Dietary} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.dietary.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_dietary',
            `SELECT * FROM dietary LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.dietary.getPage, JSON.stringify({
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
        const result = await client.get(environment.redisKeys.dietary.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}


async function create(dietary: Dietary) {
    if (!dietary) {
        return {
            message: 'Error in creating dietaries. Empty body',
            data: [],
        };
    }

    const values = [Object.values(dietary)];
    const entries = Object.keys(dietary);
    let result = await db.query(
        'insert-dietary',
        format('INSERT INTO dietary (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'Dietary created successfully';
        await client.del(environment.redisKeys.dietary.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(dietaries: Dietary[]) {
    if (!(dietaries && dietaries.length > 0)) {
        throw Error();
    }

    const values = dietaries.map((d) => {
        d.id = uuidv4();
        return Object.values(d);
    });
    const entries = Object.keys(dietaries[0]);


    let result = await db.query(
        'insert-dietaries',
        format('INSERT INTO dietary (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'Dietaries created successfully';
        await client.del(environment.redisKeys.dietary.getPage);
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
