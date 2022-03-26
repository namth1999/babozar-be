import {TagProduct} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_tag_product',
        `SELECT * FROM tag_product LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
}

async function create(tagProduct: TagProduct) {
    if (!tagProduct) {
        throw new Error('Error in creating tag_product. Empty body');
    }

    const values = [Object.values(tagProduct)];
    const entries = Object.keys(tagProduct);
    let result = await db.query(
        'insert_tag_product',
        format('INSERT INTO tag_product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'tag_product created successfully';
    } else {
        message = 'Error in creating tag_product';
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(tagsProduct: TagProduct[]) {
    if (!(tagsProduct && tagsProduct.length > 0)) {
        throw new Error('Error in creating tags. Empty body');
    }

    const values = tagsProduct.map((t) => {
        t.id = uuidv4();
        return Object.values(t);
    });
    const entries = Object.keys(tagsProduct[0]);


    let result = await db.query(
        'insert_tags_product',
        format('INSERT INTO tag_product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'tags_product created successfully';
    } else {
        message = 'Error in creating tags_product';
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
