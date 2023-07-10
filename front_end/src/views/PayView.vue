<template>
  <form id="form-checkout">
    <div class="container">
      <div class="form_pagamento">
        <div class="tabs">
          <ul class="list_tab">
            <li v-on:click="showTab=1">Informações Pessoais</li>
            <li v-on:click="showTab=2">Informações do Cartão</li>
          </ul>
        </div>
        
        <div class="tab1" v-show="showTab == 1">
          <InputField type_input="text" id_input="form-checkout__cardholderName" />
          <InputField type_input="email" id_input="form-checkout__cardholderEmail" />
          <select id="form-checkout__identificationType"></select>
          <InputField type_input="text" id_input="form-checkout__identificationNumber" />
        </div>
        
        <div class="tab2" v-show="showTab == 2">
          <InputField type_input="text" id_input="form-checkout__cardNumber" />
          <InputField type_input="text" id_input="form-checkout__expirationDate" />
          <InputField type_input="text" id_input="form-checkout__securityCode" />
        </div>
      </div>

      <div class="info_compras">

        <select id="form-checkout__issuer"></select>
        <select id="form-checkout__installments"></select>

      </div>

      <button type="submit" id="form-checkout__submit">Pagar</button>
      <progress value="0" class="progress-bar">Carregando...</progress>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import axiosInstance from "@/config/axios";
import InputField from "@/components/InputField.vue";

export default defineComponent({
  name: "PayView",
  components: {
    InputField
  },
  data() {
    return {
      showTab: 1,
    }
  },
  async mounted() {
    await loadMercadoPago();
    const mp = new window.MercadoPago("TEST-bab0e354-1ea9-48d1-abab-db8ebb513f78");
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
          },
        },
      });
    },
  },
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

.tab1, .tab2 {
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 30px;
}

input, select {
  padding: 10px;
  width: 100%;
  margin: 5px 0;
  border: none;
  outline: none;
  position: relative;
  display: block;
}

.container {
  width: 50%;
  min-width: 500px;
  height: 350px;
  border: 1px solid rgb(7, 163, 59);
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: start;
}

.form_pagamento {
  width: 70%;
  height: 100%;
  border-right: 1px solid black;
}

.list_tab {
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
