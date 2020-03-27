import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/authMiddleware';

const routes = new Router();
const upload = multer(multerConfig);

routes.get('/authenticate', SessionController.store);

routes.use(authMiddleware);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipientId', RecipientController.update);

routes.get('/deliveries', DeliverymanController.index);
routes.post('/deliveries', DeliverymanController.store);
routes.get('/deliveries/:courierId', DeliverymanController.show);
routes.put('/deliveries/:courierId', DeliverymanController.update);
routes.delete('/deliveries/:courierId', DeliverymanController.delete);

routes.get('/orders', OrderController.index);
routes.get('/orders/:orderId', OrderController.show);
routes.post('/orders', OrderController.store);
routes.put('/orders/:orderId', OrderController.update);
routes.delete('/orders/:orderId', OrderController.delete);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
