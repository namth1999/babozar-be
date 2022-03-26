import express, {NextFunction} from 'express';
import errorMiddleware from '../middlewares/error.middleware';
const router = express.Router();
const addressController = require('../controllers/address.controller');

/* GET programming languages. */
router.get('/', addressController.getPage);

/* POST programming language */
router.post('/', addressController.create);

/* POST programming language */
router.post('/multiple', addressController.createMultiple);


router.use(errorMiddleware);

module.exports = router;
