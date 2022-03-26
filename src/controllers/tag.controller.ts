import {NextFunction, Request, Response} from 'express';
import HttpException from "../utils/HttpException";

const tagService = require('../services/tag.service');

async function getPage(req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await tagService.getPage(req.query.page));
    } catch (err: any) {
        console.error(`Error while getting tag`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function create(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await tagService.create(req.body));
    } catch (err: any) {
        console.error(`Error while getting tag`, err.message);
        next(new HttpException(400, err.message));
    }
}

async function createMultiple(req: Request, res: Response, next: NextFunction) {
    try {
        res.json(await tagService.createMultiple(req.body.data));
    } catch (err: any) {
        console.error(`Error while getting tag`, err.message);
        next(new HttpException(400, err.message));
    }
}


module.exports = {
    getPage,
    create,
    createMultiple,
};
