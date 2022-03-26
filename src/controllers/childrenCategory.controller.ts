import {NextFunction, Request, Response} from 'express';
import HttpException from "../utils/HttpException";

const childrenCategory = require('../services/childrenCategory.service');

async function getPage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await childrenCategory.getPage(req.query.page));
    } catch (err: any) {
        console.error(`Error while getting childrenCategory`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await childrenCategory.create(req.body));
    } catch (err: any) {
        console.error(`Error while getting childrenCategory`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function createMultiple(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await childrenCategory.createMultiple(req.body.data));
    } catch (err: any) {
        console.error(`Error while getting childrenCategory`, err.message);
        next(new HttpException(400, err.message));
    }
}


module.exports = {
    getPage,
    create,
    createMultiple,
};
