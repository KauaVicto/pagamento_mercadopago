import { createStore } from "vuex";

type ProductDTO = {
  id: number;
  nome: string;
  valor: number;
};

const productInitial: ProductDTO = {
  id: 0,
  nome: '',
  valor: 0
}

export default createStore({
  state: {
    product: productInitial
  },
  getters: {
    getProduct(state) {
      return state.product
    }
  },
  mutations: {
    setProduct(state, newProduct: ProductDTO) {
      state.product = newProduct;
    }
  },
  actions: {},
  modules: {},
});
