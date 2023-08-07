import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { routes } from './routes/index.routes';

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

// app.get('/', (req: Request, res: Response) => {
//     res.json({ msg: 'Hello World' });
// });


// app.post('/process_payment', async (req: Request, res: Response) => {
//     try {

//         mercadopago.configurations.setAccessToken(process.env.PRIVATE_TOKEN_MERCADOPAGO)
        
//         const ResultPagamento = await mercadopago.payment.save(req.body)
//         console.log('-------------------------------')
//         console.log(ResultPagamento)
//         console.log('-------------------------------')
//         res.json({ msg: 'Hello World' });
//     }catch(err: any) {
//         console.log(err)
//         res.status(400).json({error: 'Ocorreu um erro inesperado'})
//     }

// })

app.listen(3000, () => console.log('Server is running'));
