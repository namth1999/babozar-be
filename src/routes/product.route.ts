import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const productController = require('../controllers/product.controller');

/* GET programming languages. */
router.get('/', productController.getPage);

/* POST programming language */
router.post('/', productController.create);

/* POST programming language */
router.post('/multiple', productController.createMultiple);

router.use(errorMiddleware);


module.exports = router;
