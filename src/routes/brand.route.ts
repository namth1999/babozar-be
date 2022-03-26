import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const brandsController = require('../controllers/brand.controller');

/* GET programming languages. */
router.get('/', brandsController.getPage);

/* POST programming language */
router.post('/', brandsController.create);

/* POST programming language */
router.post('/multiple', brandsController.createMultiple);

router.use(errorMiddleware);

module.exports = router;
