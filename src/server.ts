import express, {Express, NextFunction, Request, Response} from 'express';
import http from 'http';
import morgan from 'morgan';
const bodyParser = require('body-parser');
const brandRouter = require('./routes/brand.route');
const addressRouter = require('./routes/address.route');
const categoryRouter = require('./routes/category.route');
const dietaryRouter = require('./routes/dietary.route');
const childrenCategoryRouter = require('./routes/childrenCategory.route');
const productRouter = require('./routes/product.route');
const galleryProductRouter = require('./routes/galleryProduct.route');
const shopRouter = require('./routes/shop.route');
const tagRouter = require('./routes/tag.route');
const orderRouter = require('./routes/order.route');
const tagProductRouter = require('./routes/tagProduct.route');
const orderProductRouter = require('./routes/orderProduct.route');
const cors = require('cors');
const keycloakConfig = require('./config/keycloak.config');
const session = require('express-session');
const keycloak = keycloakConfig.initKeycloak();

const app: Express = express();
app.use(morgan('dev'));
app.use(session({
    secret: 'kcss',
    resave: false,
    saveUninitialized: true,
    store: keycloakConfig.memoryStore
}))

app.use(keycloak.middleware());

// support application/json type post data
app.use(bodyParser.json());
//support application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({extended: false}));
// Enable CORS support
app.use(cors());

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Hello from root'
    });
});

app.use("/brand", keycloak.protect(), brandRouter);
app.use("/address", keycloak.protect(), addressRouter);
app.use("/category", keycloak.protect(), categoryRouter);
app.use("/dietary", keycloak.protect(), dietaryRouter);
app.use("/childrencategory", keycloak.protect(), childrenCategoryRouter);
app.use("/product", keycloak.protect(), productRouter);
app.use("/galleryproduct", keycloak.protect(), galleryProductRouter);
app.use("/shop", keycloak.protect(), shopRouter);
app.use("/tag", keycloak.protect(), tagRouter);
app.use("/order", keycloak.protect(), orderRouter);
app.use("/tagproduct", keycloak.protect(), tagProductRouter);
app.use("/orderproduct", keycloak.protect(), orderProductRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
    return res.status(404).json({
        error: "Not Found",
    });
});

const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 3000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));