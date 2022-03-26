import {Category} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_categories',
        `SELECT * FROM category LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
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
    } else {
        message = 'Error in creating category';
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
    } else {
        message = 'Error in creating categories';
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
