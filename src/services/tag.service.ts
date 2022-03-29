import {Tag} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.tag.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_tag',
            `SELECT * FROM tag LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.tag.getPage, JSON.stringify({
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
        const result = await client.get(environment.redisKeys.tag.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}


async function create(tag: Tag) {
    if (!tag) {
        throw new Error('Error in creating product. Empty body');
    }

    const values = [Object.values(tag)];
    const entries = Object.keys(tag);
    let result = await db.query(
        'insert-tag',
        format('INSERT INTO tag (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'tag created successfully';
        await client.del(environment.redisKeys.tag.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(tags: Tag[]) {
    if (!(tags && tags.length > 0)) {
        throw new Error('Error in creating tags. Empty body');
    }

    const values = tags.map((t) => {
        t.id = uuidv4();
        return Object.values(t);
    });
    const entries = Object.keys(tags[0]);


    let result = await db.query(
        'insert-tags',
        format('INSERT INTO tag (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'tags created successfully';
        await client.del(environment.redisKeys.tag.getPage);
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
