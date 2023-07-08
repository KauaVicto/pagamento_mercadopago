<template>
  <div class="container">
    <form id="form-checkout">
      <div class="geral">
        <div class="tabs">

        </div>

        <div class="tab1">
          <input type="text" id="form-checkout__cardholderName" />
          <input type="email" id="form-checkout__cardholderEmail" />
          <select id="form-checkout__identificationType"></select>
          <input type="text" id="form-checkout__identificationNumber" />
        </div>

        <div class="tab2">
          <div id="form-checkout__cardNumber"></div>
          <div id="form-checkout__expirationDate"></div>
          <div id="form-checkout__securityCode"></div>
        </div>
      </div>


      <select id="form-checkout__issuer"></select>
      <select id="form-checkout__installments"></select>


      <button type="submit" id="form-checkout__submit">Pagar</button>
      <progress value="0" class="progress-bar">Carregando...</progress>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loadMercadoPago } from "@mercadopago/sdk-js";
import axiosInstance from "@/config/axios";

export default defineComponent({
  name: "PayView",
  async mounted() {
    await loadMercadoPago();
    const mp = new window.MercadoPago("TEST-bab0e354-1ea9-48d1-abab-db8ebb513f78");
    this.configCardForm(mp);
  },
  methods: {
    configCardForm: (mp: any) => {
      const cardForm = mp.cardForm({
        amount: "20",
        iframe: true,
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
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

#form-checkout {
  width: 50%;
  min-width: 400px;
  background-color: rgb(211, 211, 211);
}
</style>
