import {ChildrenCategory} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_children_category',
        `SELECT * FROM children_category LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
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
    } else {
        message = 'Error in creating childrenCategory';
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
    } else {
        message = 'Error in creating childrenCategories';
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
