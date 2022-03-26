import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const categoryController = require('../controllers/category.controller');

/* GET programming languages. */
router.get('/', categoryController.getPage);

/* POST programming language */
router.post('/', categoryController.create);

/* POST programming language */
router.post('/multiple', categoryController.createMultiple);

router.use(errorMiddleware);

module.exports = router;
