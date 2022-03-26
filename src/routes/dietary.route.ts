import express from 'express';
import errorMiddleware from "../middlewares/error.middleware";
const router = express.Router();
const dietaryController = require('../controllers/dietary.controller');

/* GET programming languages. */
router.get('/', dietaryController.getPage);

/* POST programming language */
router.post('/', dietaryController.create);

/* POST programming language */
router.post('/multiple', dietaryController.createMultiple);


router.use(errorMiddleware);


module.exports = router;
