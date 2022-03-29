import {ChildrenCategory} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.childrenCategory.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_children_category',
            `SELECT * FROM children_category LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.childrenCategory.getPage, JSON.stringify({
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
        const result = await client.get(environment.redisKeys.childrenCategory.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}



async function create(childrenCategory : ChildrenCategory) {
    if (!childrenCategory) {
        return {
            message: 'Error in creating dietaries. Empty body',
            data: [],
        };
    }

    const values = [Object.values(childrenCategory)];
    const entries = Object.keys(childrenCategory);
    let result = await db.query(
        'insert-dietary',
        format('INSERT INTO children_category (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'childrenCategory created successfully';
        await client.del(environment.redisKeys.childrenCategory.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(childrenCategories : ChildrenCategory[]) {
    if (!(childrenCategories && childrenCategories.length > 0)) {
        throw new Error('Error in creating childrenCategories');
    }

    const values = childrenCategories.map((c) => {
        c.id = uuidv4();
        return Object.values(c);
    });
    const entries = Object.keys(childrenCategories[0]);


    let result = await db.query(
        'insert-children_categories',
        format('INSERT INTO children_category (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'Children Categories created successfully';
        await client.del(environment.redisKeys.childrenCategory.getPage);
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
