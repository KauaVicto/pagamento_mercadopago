<template>
  <form id="form-checkout">
    <div class="container">
      <div class="tabs">
        <ul class="list_tab" v-bind:class="{ 'active1': showTab == 1, 'active2': showTab == 2 }">
          <li id="tab_info_pessoal" v-on:click="showTab = 1">Informações Pessoais</li>
          <li id="tab_info_cartao" v-on:click="showTab = 2">Informações do Cartão</li>
        </ul>
      </div>
      <div class="form_pagamento">

        <div class="tab1" v-show="showTab == 1">
          <InputField type_input="text" id_input="form-checkout__cardholderName" v-model="cardholderName" />
          <InputField type_input="email" id_input="form-checkout__cardholderEmail" />
          <select id="form-checkout__identificationType"></select>
          <InputField type_input="text" id_input="form-checkout__identificationNumber" />
          <ButtonComponent class="btn-proximo" text_button="Próximo" v-on:click="proximaEtapa" />
        </div>

        <div class="tab2" v-show="showTab == 2">
          <InputField type_input="text" id_input="form-checkout__cardNumber"
            v-on:keyup="keyPressCardNumber($event.target.value)"
            @keydown.ctrl.86="keyPressCardNumber($event.target.value)" v-model="cardNumber" />
          <div class="form-group">
            <InputField type_input="text" id_input="form-checkout__expirationDate" v-model="expirationDate" />
            <InputField type_input="text" id_input="form-checkout__securityCode" />
          </div>
          <select id="form-checkout__issuer"></select>
          <select id="form-checkout__installments"></select>
        </div>


      </div>

      <div class="info_cartao">
        <CartaoComponent :titular="cardholderName" :numero_cartao="formatCardNumber(cardNumber)" :issuer="issuer" />
      </div>

      <div class="info_compras">


        <button type="submit" id="form-checkout__submit">Pagar</button>

      </div>


    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import axiosInstance from "@/config/axios";
import axios from "axios";
import InputField from "@/components/InputField.vue";
import ButtonComponent from "@/components/ButtonComponent.vue";
import CartaoComponent from "@/components/CartaoComponent.vue";

export default defineComponent({
  name: "PayView",
  components: {
    InputField,
    ButtonComponent,
    CartaoComponent
  },
  data() {
    return {
      showTab: 1,
      cardholderName: '',
      cardNumber: '',
      expirationDate: '',
      issuer: '',
      public_key: 'TEST-bab0e354-1ea9-48d1-abab-db8ebb513f78'
    }
  },
  async mounted() {
    await loadMercadoPago();
    const mp = new window.MercadoPago(this.public_key);
    this.configCardForm(mp);
  },
  methods: {
    configCardForm: (mp: any) => {
      const cardForm = mp.cardForm({
        amount: "20",
        iframe: false,
        form: {
          id: "form-checkout",
          cardNumber: {
            id: "form-checkout__cardNumber",
            placeholder: "Número do cartão",
          },
          expirationDate: {
            id: "form-checkout__expirationDate",
            placeholder: "MM/YY",
          },
          securityCode: {
            id: "form-checkout__securityCode",
            placeholder: "Código de segurança",
          },
          cardholderName: {
            id: "form-checkout__cardholderName",
            placeholder: "Titular do cartão",
          },
          issuer: {
            id: "form-checkout__issuer",
            placeholder: "Banco emissor",
          },
          installments: {
            id: "form-checkout__installments",
            placeholder: "Parcelas",
          },
          identificationType: {
            id: "form-checkout__identificationType",
            placeholder: "Tipo de documento",
          },
          identificationNumber: {
            id: "form-checkout__identificationNumber",
            placeholder: "Número do documento",
          },
          cardholderEmail: {
            id: "form-checkout__cardholderEmail",
            placeholder: "E-mail",
          },
        },
        callbacks: {
          onFormMounted: (error: any) => {
            if (error)
              return console.warn("Form Mounted handling error: ", error);
            console.log("Form mounted");
          },
          onSubmit: (event: any) => {
            event.preventDefault();


            const {
              paymentMethodId: payment_method_id,
              issuerId: issuer_id,
              cardholderEmail: email,
              amount,
              token,
              installments,
              identificationNumber,
              identificationType,
            } = cardForm.getCardFormData();

            axiosInstance.post(
              "/process_payment",
              JSON.stringify({
                token,
                issuer_id,
                payment_method_id,
                transaction_amount: Number(amount),
                installments: Number(installments),
                description: "Descrição do produto",
                payer: {
                  email,
                  identification: {
                    type: identificationType,
                    number: identificationNumber,
                  },
                },
              }),
              {
                headers: {
                  "Content-Type": "application/json",
                }
              }
            )
              .then((response: any) => {

              })
              .catch((error: any) => {
                console.log(error)
              });
          },
          onFetching: (resource: any) => {
            // Buscando
            console.log('buscando')
          },
        },
      });
    },
    proximaEtapa: function (e: any) {
      this.showTab = 2
    },
    formatCardNumber: function (number: string) {
      if (!number) return '';

      return number.replace(/(.{4})/g, '$1 ')
    },
    keyPressCardNumber: function (value: string) {
      if (value.length >= 6) {
        if (!this.issuer) {

          axios.get('https://api.mercadopago.com/v1/payment_methods/installments', { params: { public_key: this.public_key, bin: value } })
            .then((response) => {
              this.issuer = response.data[0].payment_method_id;
            })
            .catch((error) => {
              console.log(error)
            })
        }
      } else {
        this.issuer = ''
      }
    }
  }
});
</script>

<style scoped>
#form-checkout {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 90%;
  min-width: 700px;
  max-width: 1100px;
  height: 60vh;
  min-height: 400px;
  display: grid;
  justify-content: center;
  gap: 10px;
  grid-template:
    "tabs tabs info_compras" 20%
    "form_pagamento cartao info_compras" auto
    / 40% 30% 25%
}

.container>div {
  border-radius: 10px;
  background-color: white;
}

.tabs {
  grid-area: tabs;
}

.info_compras {
  grid-area: info_compras;
}

.form_pagamento {
  grid-area: form_pagamento;
}

.list_tab {
  height: 100%;
  list-style: none;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  padding: 0;
  margin: 0;
  position: relative;
}

.list_tab::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 2px;
  background-color: #087bdf;
  transition: .5s ease-in-out;
}

.list_tab.active1::after {
  left: 0;
}

.list_tab.active2::after {
  left: 50%;
}

.list_tab li {
  height: 100%;
  user-select: none;
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}



.tab1,
.tab2 {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 10px;
}

.btn-proximo {
  align-self: flex-end;
  width: 50%;
}

.form-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

input,
select {
  padding: 10px;
  width: 100%;
  margin: 5px 0;
  border: none;
  outline: none;
  position: relative;
  display: block;
}

.container .info_cartao {
  grid-area: cartao;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
</style>
