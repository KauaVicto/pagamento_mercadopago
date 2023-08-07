import { Request, Response } from "express";
import { productModel } from "../models/productModel";
import mercadopago from 'mercadopago';


export const paymentController = {
    processPayment: async (req: Request, res: Response) => {
        try {
            const productId: string = req.body.productId
            const { transaction_amount } = req.body.paymentForm

            const productResult = await productModel.findById(productId);

            if (!productResult)
                throw { error: new Error('Product not found') };


            if (productResult.valor != transaction_amount)
                throw { error: new Error('Há uma inconsistência nas informações do pagamento') }

            mercadopago.configurations.setAccessToken(process.env.PRIVATE_TOKEN_MERCADOPAGO)

            const ResultPagamento = await mercadopago.payment.save(req.body.paymentForm)

            res.status(200).json({ msg: 'Pagamento Feito com sucesso' });
        } catch (err: any) {
            if (err.error) {
                return res.status(400).json({ error: err.error.message });
            }
            res.status(400).json({ error: 'Ocorreu um erro ao efetuar o pagamento' });
        }

    }
}