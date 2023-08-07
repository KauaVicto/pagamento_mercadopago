import { Router } from 'express';
import { paymentRoutes } from './payment.routes';
import { productRoutes } from './products.routes';

const routes: Router = Router();

routes.use('/payment', paymentRoutes);

routes.use('/product', productRoutes);

export { routes }



