import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const galleryProductController = require('../controllers/galleryProduct.controller');

/* GET programming languages. */
router.get('/', galleryProductController.getPage);

/* POST programming language */
router.post('/', galleryProductController.create);

/* POST programming language */
router.post('/multiple', galleryProductController.createMultiple);


router.use(errorMiddleware);

module.exports = router;
