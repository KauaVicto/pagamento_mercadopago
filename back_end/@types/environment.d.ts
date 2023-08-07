declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PRIVATE_TOKEN_MERCADOPAGO: string;
        }
    }
}

export {};