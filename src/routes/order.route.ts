import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";

const router = express.Router();
const orderController = require('../controllers/order.controller');

/* GET programming languages. */
router.get('/', orderController.getPage);

/* POST programming language */
router.post('/', orderController.create);

/* POST programming language */
router.post('/multiple', orderController.createMultiple);



router.use(errorMiddleware);

module.exports = router;
