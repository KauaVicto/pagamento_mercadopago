<template>
  <form id="form-checkout">
    <div class="container">
      <div class="form">
        <div class="tabs">
          <ul class="list_tab" v-bind:class="{ 'active1': showTab == 1, 'active2': showTab == 2 }">
            <li id="tab_info_pessoal" v-on:click="showTab = 1">Informações Pessoais</li>
            <li id="tab_info_cartao" v-on:click="showTab = 2">Informações do Cartão</li>
          </ul>
        </div>

        <div class="form_card">
          <div class="form_pagamento">
            <div class="tab1" v-show="showTab == 1">
              <InputField type_input="text" id_input="form-checkout__cardholderName" v-model="cardholderName" />
              <InputField type_input="email" id_input="form-checkout__cardholderEmail" v-model="cardholderEmail" />
              <select id="form-checkout__identificationType" v-model="identificationType"></select>
              <InputField type_input="text" id_input="form-checkout__identificationNumber" mask_input="cpf" />
              <ButtonComponent class="btn-proximo" text_button="Próximo" v-on:click="proximaEtapa" />
            </div>
            <div class="tab2" v-show="showTab == 2">
              <InputField type_input="text" id_input="form-checkout__cardNumber"
                v-on:keyup="keyPressCardNumber($event.target.value)" @paste="keyPressCardNumber($event.target.value)"
                v-model="cardNumber" mask_input="cardNumber" />
              <div class="form-group">
                <InputField type_input="text" id_input="form-checkout__expirationDate" v-model="expirationDate"
                  mask_input="date" />
                <InputField type_input="text" id_input="form-checkout__securityCode" v-model="securityCode"
                  max_length="3" />
              </div>
              <select id="form-checkout__issuer"></select>
              <select id="form-checkout__installments"></select>
            </div>
          </div>
          <div class="card">
            <CardComponent :titular="cardholderName" :numero_cartao="cardNumber" :issuer="issuer"
              :expiration_date="expirationDate" :security_code="securityCode" />
          </div>
        </div>
      </div>

      <div class="info_compras">
        <h2>Resumo da compra</h2>
        <h4>Produto: {{ productName }}</h4>
        <h4>Valor: {{ productAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}</h4>

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
import CardComponent from "@/components/CardComponent.vue";
import { useStore } from 'vuex';

export default defineComponent({
  name: "PayView",
  components: {
    InputField,
    ButtonComponent,
    CardComponent
  },
  data() {
    return {
      showTab: 1,
      productId: '',
      productAmount: 0,
      productAmounttotal: 0,
      productName: '',
      cardholderName: '',
      cardNumber: '',
      expirationDate: '',
      cardholderEmail: '',
      identificationType: '',
      issuer: '',
      securityCode: '',
      public_key: 'TEST-bab0e354-1ea9-48d1-abab-db8ebb513f78'
    }
  },
  async mounted() {
    const store = useStore();
    await loadMercadoPago();

    // buscar produto
    axiosInstance.get(`/product/findById/${this.$route.params.id}`)
      .then((response) => {
        store.commit('setProduct', response.data);
        this.productAmount = response.data.valor;
        this.productName = response.data.nome;
        this.productId = response.data.id;

        const mp = new window.MercadoPago(this.public_key);
        this.configCardForm(mp);
      })
      .catch((error) => {
        console.log(error)
      });
  },
  methods: {
    configCardForm(mp: any) {
      const cardForm = mp.cardForm({
        amount: `${this.productAmount}`,
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
            console.table(cardForm.getCardFormData())

            axiosInstance.post("/payment/process_payment",
              JSON.stringify({
                productId: this.productId,
                paymentForm: {
                  token,
                  issuer_id,
                  payment_method_id,
                  transaction_amount: Number(amount),
                  installments: Number(installments),
                  description: this.productName,
                  payer: {
                    email,
                    identification: {
                      type: identificationType,
                      number: identificationNumber,
                    },
                  }
                }
              }
              ),
              {
                headers: {
                  "Content-Type": "application/json",
                }
              }
            )
              .then((response: any) => {
                console.log(response);
                alert('pagamento feito com sucesso')
              });
          },
          onFetching: (resource: any) => {
            // Buscando
            console.log('buscando')
          }
        },
      });
    },
    proximaEtapa: function (e: any) {
      this.showTab = 2
    },
    keyPressCardNumber: function (value: string) {
      let valueNumber = value.replace(/ /g, '');
      if (valueNumber.length >= 6) {
        if (!this.issuer) {

          axios.get('https://api.mercadopago.com/v1/payment_methods/installments', { params: { public_key: this.public_key, bin: valueNumber, amount: 1000 } })
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
  max-width: 1100px;
  height: 60vh;
  min-height: 400px;
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: initial;
}

.container>div {
  border-radius: 10px;
  background-color: rgb(46, 42, 42);
}

.card {
  max-width: 400px;
}

.container .form {
  flex: 2;
}

.container .info_compras {
  flex: 1;
  padding: 5px 20px;
}

.container .info_compras h2 {
  text-align: center;
}

.form .tabs {
  height: 80px;
  margin-bottom: 20px;
  font-size: .9rem;
  text-align: center;
}


.form .form_card {
  display: flex;
  justify-content: space-around;
  align-items: start;
  gap: 30px;

}

.form .form_card>div {
  width: 45%;
}

.form {
  height: 450px;
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
  background-color: #035ead;
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
  height: 300px;
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

#form-checkout__submit {
  padding: 10px;
  background-color: #035ead;
  border: none;
  border-radius: 20px;
  width: 100%;
}

select {
  padding: 10px;
  width: 100%;
  margin: 5px 0;
  border: none;
  outline: none;
  position: relative;
  display: block;
  background-color: rgba(56, 52, 52, 0.719);
}

@media screen and (max-width: 1220px) {
  .container {
    flex-direction: column-reverse;
    justify-content: space-evenly;
    width: 80vw;
  }

  .form {
    height: 850px;
  }

  .form .tabs {
    margin: 0;
  }

  .form .form_card {
    flex-direction: column;
    padding: 20px 10px;
  }

  .form .form_card>div {
    width: 100%;
    margin: 0 auto;
  }

  .card {
    display: none;
  }
}
</style>
