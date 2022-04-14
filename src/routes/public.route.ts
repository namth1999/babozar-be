import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const categoryController = require('../controllers/category.controller');

/* GET programming languages. */
router.get('/category/getAll', categoryController.getAll);

router.use(errorMiddleware);

module.exports = router;
