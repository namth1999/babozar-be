import {Product} from "../models/models";
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

    const exist = await client.exists(environment.redisKeys.product.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_product',
            `SELECT * FROM product LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.product.getPage, JSON.stringify({
            data,
            meta
        }), {
            EX: 3600,
            NX: true,
        });

        return {
            data,
            meta
        };
    } else {
        const result = await client.get(environment.redisKeys.product.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}


async function getHomeBestProducts() {
    const result = await db.query(
        'fetch_best_products',
        `SELECT * FROM product where best_seller = true LIMIT $1`,
        [config.limitHomeBestProducts]
    );
    const data = helper.emptyOrRows(result.rows)

    await client.set(environment.redisKeys.product.getHomeBestProduct, JSON.stringify({
        data,
    }), {
        EX: 3600,
        NX: true,
    });

    return {
        data,
    };
}

async function searchProducts(keyword: string) {
    const searchPhrase = keyword.split(" ").reduce((pre, current) => {
        if (!pre)
            return current
        return `${pre} & ${current}`;
    }, "");
    const result = await db.query(
        'search_products',
        `select * from product where to_tsvector(name) @@ to_tsquery($1)
                       or to_tsvector(description) @@ to_tsquery($1) order by name`,
        [searchPhrase]
    );
    const data = helper.emptyOrRows(result.rows)
    return {
        data,
    };
}


async function create(product: Product) {
    if (!product) {
        throw new Error('Error in creating product. Empty body');
    }

    const values = [Object.values(product)];
    const entries = Object.keys(product);
    let result = await db.query(
        'insert-product',
        format('INSERT INTO product (%s) VALUES %L RETURNING *', entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'product created successfully';
        await client.del(environment.redisKeys.product.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(products: Product[]) {
    if (!(products && products.length > 0)) {
        throw new Error('Error in creating products. Empty body');
    }

    const values = products.map((p) => {
        p.id = uuidv4();
        return Object.values(p);
    });
    const entries = Object.keys(products[0]);


    let result = await db.query(
        'insert-products',
        format('INSERT INTO product (%s) VALUES %L RETURNING *', entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'Products created successfully';
        await client.del(environment.redisKeys.product.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

module.exports = {
    getPage,
    searchProducts,
    getHomeBestProducts,
    create,
    createMultiple,
}
