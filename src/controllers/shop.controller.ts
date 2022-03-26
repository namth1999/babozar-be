import {NextFunction, Request, Response} from 'express';
import HttpException from "../utils/HttpException";

const shopService = require('../services/shop.service');

async function getPage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await shopService.getPage(req.query.page));
    } catch (err: any) {
        console.error(`Error while getting shop`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await shopService.create(req.body));
    } catch (err: any) {
        console.error(`Error while getting shop`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function createMultiple(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await shopService.createMultiple(req.body.data));
    } catch (err: any) {
        console.error(`Error while getting shop`, err.message);
        next(new HttpException(400, err.message));
    }
}

module.exports = {
    getPage,
    create,
    createMultiple,
};
