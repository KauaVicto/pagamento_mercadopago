<template>
  <div class="home">
    <form id="form-checkout">
      <div id="form-checkout__cardNumber"></div>
      <div id="form-checkout__expirationDate"></div>
      <div id="form-checkout__securityCode"></div>
      <input type="text" id="form-checkout__cardholderName" />
      <select id="form-checkout__issuer"></select>
      <select id="form-checkout__installments"></select>
      <select id="form-checkout__identificationType"></select>
      <input type="text" id="form-checkout__identificationNumber" />
      <input type="email" id="form-checkout__cardholderEmail" />

      <button type="submit" id="form-checkout__submit">Pagar</button>
      <progress value="0" class="progress-bar">Carregando...</progress>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { loadMercadoPago } from "@mercadopago/sdk-js";

export default defineComponent({
  name: "PayView",
  async mounted() {
    await loadMercadoPago();
    const mp = new window.MercadoPago("");
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

            fetch("/process_payment", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
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
/* Estilos gerais */
.container {
  margin-bottom: 10px;
}

input[type="text"],
select,
button {
  display: block;
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button[type="submit"] {
  background-color: #4caf50;
  color: white;
  cursor: pointer;
}

.progress-bar {
  display: block;
  width: 100%;
  padding: 10px;
}

/* Estilos específicos */
#form-checkout__cardNumber {
  /* Adicione estilos personalizados para o campo de número do cartão */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__expirationDate {
  /* Adicione estilos personalizados para o campo de data de validade */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__securityCode {
  /* Adicione estilos personalizados para o campo de código de segurança */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__cardholderName {
  /* Adicione estilos personalizados para o campo de nome do titular do cartão */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__issuer {
  /* Adicione estilos personalizados para o campo de emissor */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__installments {
  /* Adicione estilos personalizados para o campo de parcelas */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__identificationType {
  /* Adicione estilos personalizados para o campo de tipo de identificação */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__identificationNumber {
  /* Adicione estilos personalizados para o campo de número de identificação */
  background-color: #f2f2f2;
  padding: 12px;
}

#form-checkout__cardholderEmail {
  /* Adicione estilos personalizados para o campo de e-mail do titular do cartão */
  background-color: #f2f2f2;
  padding: 12px;
}
</style>
