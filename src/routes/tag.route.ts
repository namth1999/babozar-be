import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const tagController = require('../controllers/tag.controller');

/* GET programming languages. */
router.get('/', tagController.getPage);

/* POST programming language */
router.post('/', tagController.create);

/* POST programming language */
router.post('/multiple', tagController.createMultiple);

router.use(errorMiddleware);

module.exports = router;
