import { Request, Response } from "express";
import { productModel } from "../models/productModel";



export const productController = {
    findById: (req: Request, res: Response) => {

        try {

            const productId: string = req.params.id;

            const productResult = productModel.findById(productId);

            res.status(200).json(productResult);
        } catch (err: any) {
            if (err.error) {
                return res.status(400).json({ error: err.error.message });
            }
            res.status(400).json({ error: 'Ocorreu um erro ao buscar o produto' });
        }

    }
}