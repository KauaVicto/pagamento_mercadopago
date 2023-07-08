/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare interface Window {
  MercadoPago: class; // Substitua "minhaVariavel" pelo nome da sua variável personalizada
}