import {GalleryProduct} from "../models/models";
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

    const exist =  await client.exists(environment.redisKeys.galleryProduct.getPage);
    if (!exist) {
        const result = await db.query(
            'fetch_gallery_product',
            `SELECT * FROM gallery_product LIMIT $1 OFFSET $2`,
            [config.itemsPerPage, offset]
        );
        const data = helper.emptyOrRows(result.rows)
        const meta = {page};

        await client.set(environment.redisKeys.galleryProduct.getPage, JSON.stringify({
            data,
        }));
        await client.expire(environment.redisKeys.galleryProduct.getPage, 60);

        return {
            data,
            meta
        };
    } else {
        const result = await client.get(environment.redisKeys.galleryProduct.getPage);
        if (result) {
            return JSON.parse(result);
        } else {
            throw new HttpException(500, "Empty cache")
        }
    }
}



async function create(galleryProduct: GalleryProduct) {
    if (!galleryProduct) {
        throw new Error('Error in creating gallery_product. Empty body');
    }

    const values = [Object.values(galleryProduct)];
    const entries = Object.keys(galleryProduct);
    let result = await db.query(
        'insert_gallery_product',
        format('INSERT INTO gallery_product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []);

    let message;

    if (result) {
        message = 'product created successfully';
        await client.del(environment.redisKeys.galleryProduct.getPage);
    }

    const data = helper.emptyOrRows(result.rows);

    return {
        message,
        data
    };
}

async function createMultiple(galleryProducts: GalleryProduct[]) {
    if (!(galleryProducts && galleryProducts.length > 0)) {
        return {
            message: 'Error in creating gallery_products. Empty body',
            data: [],
        };
    }

    const values = galleryProducts.map((g) => {
        g.id = uuidv4();
        return Object.values(g);
    });
    const entries = Object.keys(galleryProducts[0]);

    let result = await db.query(
        'insert_gallery_product',
        format('INSERT INTO gallery_product (%s) VALUES %L RETURNING *',entries.toString(), values),
        []
    )

    let message;

    if (result && result.rows.length > 0) {
        message = 'galleryProducts created successfully';
        await client.del(environment.redisKeys.galleryProduct.getPage);
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
