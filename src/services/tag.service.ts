import {Tag} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_tag',
        `SELECT * FROM tag LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
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
    } else {
        message = 'Error in creating tag';
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
    } else {
        message = 'Error in creating tags';
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
