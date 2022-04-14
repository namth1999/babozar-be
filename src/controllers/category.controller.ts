import {NextFunction, Request, Response} from 'express';
import HttpException from "../utils/HttpException";

const categoryService = require('../services/category.service');

async function getPage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await categoryService.getPage(req.query.page));
    } catch (err: any) {
        console.error(`Error while getting category`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function getAll(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await categoryService.getAll());
    } catch (err: any) {
        console.error(`Error while getting category`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await categoryService.create(req.body));
    } catch (err: any) {
        console.error(`Error while getting category`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function createMultiple(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await categoryService.createMultiple(req.body.data));
    } catch (err: any) {
        console.error(`Error while getting category`, err.message);
        next(new HttpException(400, err.message));
    }
}


module.exports = {
    getPage,
    getAll,
    create,
    createMultiple,
};
