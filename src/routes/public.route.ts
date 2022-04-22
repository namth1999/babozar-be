import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const productController = require('../controllers/product.controller');

/* GET programming languages. */
router.get('/category/getAll', categoryController.getAll);

router.get('/product/getHomeBestProducts', productController.getHomeBestProducts);
router.get('/product/search', productController.getHomeBestProducts);

router.use(errorMiddleware);

module.exports = router;
