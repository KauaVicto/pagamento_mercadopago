import { Request, Response, Router } from 'express';
import { paymentController } from '../controllers/paymentController';

const paymentRoutes: Router = Router();

paymentRoutes.post('/process_payment', paymentController.processPayment);

export { paymentRoutes }



