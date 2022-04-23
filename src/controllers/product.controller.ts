import {NextFunction, Request, Response} from 'express';
import HttpException from "../utils/HttpException";

const productService = require('../services/product.service');

async function getPage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await productService.getPage(req.query.page));
    } catch (err: any) {
        console.error(`Error while getting product`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function getHomeBestProducts(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await productService.getHomeBestProducts());
    } catch (err: any) {
        console.error(`Error while getting home best products`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await productService.getProductById(req.body.id));
    } catch (err: any) {
        console.error(`Error while getting home best products`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await productService.searchProducts(req.body.keyword));
    } catch (err: any) {
        console.error(`Error while getting home best products`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await productService.create(req.body));
    } catch (err: any) {
        console.error(`Error while getting product`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function createMultiple(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await productService.createMultiple(req.body.data));
    } catch (err: any) {
        console.error(`Error while getting product`, err.message);
        next(new HttpException(400, err.message));
    }
}


module.exports = {
    getPage,
    searchProducts,
    getProductById,
    getHomeBestProducts,
    create,
    createMultiple,
};
