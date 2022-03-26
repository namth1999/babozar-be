import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const tagProductController = require('../controllers/tagProduct.controller');

/* GET programming languages. */
router.get('/', tagProductController.getPage);

/* POST programming language */
router.post('/', tagProductController.create);

/* POST programming language */
router.post('/multiple', tagProductController.createMultiple);

router.use(errorMiddleware);

module.exports = router;
