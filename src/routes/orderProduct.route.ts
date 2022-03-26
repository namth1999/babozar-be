import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const orderProductController = require('../controllers/orderProduct.controller');

/* GET programming languages. */
router.get('/', orderProductController.getPage);

/* POST programming language */
router.post('/', orderProductController.create);

/* POST programming language */
router.post('/multiple', orderProductController.createMultiple);


router.use(errorMiddleware);


module.exports = router;
