import { Router } from 'express';
import { productController } from '../controllers/productController';

const productRoutes: Router = Router();

productRoutes.get('/findById/:id', productController.findById);

export { productRoutes };



