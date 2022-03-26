import {Brand} from "../models/models";

const db = require('./db.service');
const helper = require('../utils/helper.util');
const config = require('../config/page.config');
const format = require('pg-format');
const {v4: uuidv4} = require("uuid");

async function getPage(page = 1) {
    const offset = helper.getOffset(page, config.itemsPerPage);

    const result = await db.query(
        'fetch_brands',
        `SELECT * FROM brand LIMIT $1 OFFSET $2`,
        [config.itemsPerPage, offset]
    );
    const data = helper.emptyOrRows(result.rows)
    const meta = {page};

    return {
        data,
        meta
    };
}

async function create(brand : Brand) {
    let result = await db.query(
        'insert-brand',
        `INSERT INTO brand VALUES($1,$2,$3) RETURNING *`,
        [uuidv4(), brand.name, brand.slug]);

    let message;

    if (result) {
        message = 'Brand created successfully';
    } else {
        message = 'Error in creating brand';
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
    } else {
        message = 'Error in creating brands';
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
