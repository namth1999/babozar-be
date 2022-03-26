import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const childrenCategoryController = require('../controllers/childrenCategory.controller');

/* GET programming languages. */
router.get('/', childrenCategoryController.getPage);

/* POST programming language */
router.post('/', childrenCategoryController.create);

/* POST programming language */
router.post('/multiple', childrenCategoryController.createMultiple);


router.use(errorMiddleware);

module.exports = router;
