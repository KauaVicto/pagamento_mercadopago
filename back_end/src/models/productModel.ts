type ProductDTO = {
    id: string;
    nome: string;
    valor: number;
}

const products: ProductDTO[] = [
    {
        id: 'fasdui2rufh2387r',
        nome: 'PS5',
        valor: 3000
    }
]

export const productModel = {
    findById: (id: string): ProductDTO => {
        const product = products.find(value => value.id == id)

        if (product) {
            return product;
        } else {
            throw { error: new Error('Product not found') };
        }

    }
};