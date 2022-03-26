import {NextFunction, Request, Response} from 'express';
import HttpException from "../utils/HttpException";

const orderProductService = require('../services/orderProduct.service');

async function getPage(req: Request, res: Response, next: NextFunction){
    try {
        res.status(200).json(await orderProductService.getPage(req.query.page));
    } catch (err: any) {
        console.error(`Error while getting orderProduct`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await orderProductService.create(req.body));
    } catch (err: any) {
        console.error(`Error while getting orderProduct`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function createMultiple(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await orderProductService.createMultiple(req.body.data));
    } catch (err: any) {
        console.error(`Error while getting orderProducts`, err.message);
        next(new HttpException(400, err.message));
    }
}

module.exports = {
    getPage,
    create,
    createMultiple,
};
