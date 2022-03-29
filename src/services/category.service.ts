import {Category} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.category.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_categories',
            `SELECT * FROM category LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.category.getPage, JSON.stringify({
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
        const result = await client.get(environment.redisKeys.category.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}


async function create(category : Category) {
    if (!category) {
        return {
            message: 'Error in creating category. Empty body',
            data: [],
        };
    }
    let result = await db.query(
        'insert-category',
        `INSERT INTO category VALUES($1,$2,$3) RETURNING *`,
        [uuidv4(), category.name, category.slug]);

    let message;

    if (result) {
        message = 'Category created successfully';
        await client.del(environment.redisKeys.category.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(categories: Category[]) {
    if (!(categories && categories.length > 0)) {
        return {
            message: 'Error in creating categories. Empty body',
            data: [],
        };
    }

    const values = categories.map((cate) => {
        cate.id = uuidv4();
        return Object.values(cate);
    });
    const entries = Object.keys(categories[0]);


    let result = await db.query(
        'insert-categories',
        format('INSERT INTO category (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'categories created successfully';
        await client.del(environment.redisKeys.category.getPage);
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
