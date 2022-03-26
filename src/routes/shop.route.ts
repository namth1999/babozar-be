import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const shopController = require('../controllers/shop.controller');

/* GET programming languages. */
router.get('/', shopController.getPage);

/* POST programming language */
router.post('/', shopController.create);

/* POST programming language */
router.post('/multiple', shopController.createMultiple);

router.use(errorMiddleware);


module.exports = router;
