<template>
    <div class="cartao" v-on:mouseover="console.log(numero_cartao)" :class="{ 'master': issuer == 'master', 'visa': issuer == 'visa' }">
        <p id="text-titular">{{ titular.length > 0 ? titular : 'NOME DO TITULAR' }}</p>
        <p id="numero-cartao">{{ numero_cartao.length > 0 ? numero_cartao : '**** **** **** ****' }}</p>
        <p id="expiration-date-cartao">{{ expiration_date.length > 0 ? expiration_date : '**/**' }}</p>
        <p id="security-code-cartao">{{ security_code.length > 0 ? security_code : '***' }}</p>
        <img class="issuer" v-show="issuer" :src="caminhoImagem" alt="">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name: "CardComponent",
    props: {
        titular: {
            type: String,
            default: ''
        },
        numero_cartao: {
            type: String,
            default: ''
        },
        expiration_date: {
            type: String,
            default: ''
        },
        issuer: {
            type: String
        },
        security_code: {
            type: String,
            default: ''
        }
        
    },
    computed: {
        caminhoImagem() {
            if (this.issuer) {
                try {
                    return require(`@/assets/issuers/${this.issuer}.png`);
                } catch (err: any) {
                    return ''
                }
            }
        }
    }
});

</script>

<style scoped>
.cartao {
    position: relative;
    background-image: url('@/assets/cartao.png'), linear-gradient(45deg, rgb(190, 191, 192), rgb(207, 208, 209), rgb(190, 191, 192));
    background-size: cover;
    width: 100%;
    aspect-ratio: 16 / 10;
    border: 1px solid black;
    border-radius: 10px;
    text-transform: uppercase;
    font-size: 60%;
    transition: .3s all ease-in-out;
    padding: 10px;
    user-select: none;
}

.cartao p {
    position: absolute;
    font-size: 2em;
    font-weight: 600;
    font-family: monospace;
    margin: 0;
    color: black;
    transition: .1s all ease-in-out;
}

.cartao.master {
    background-image: url('@/assets/cartao.png'), linear-gradient(45deg, rgb(167, 116, 7), rgb(199, 138, 8), rgb(167, 116, 7));
}
.cartao.visa {
    background-image: url('@/assets/cartao.png'), linear-gradient(45deg, rgb(34, 68, 119), rgb(17, 56, 116), rgb(34, 68, 119));
    color: white;
}
.cartao.master p,
.cartao.visa p {
    color: white;
}



#text-titular {
    top: 56%;
    left: 9%;
    font-size: 2.3em;
    letter-spacing: 1px;
}

#numero-cartao {
    top: 33.5%;
    left: 27%;
    letter-spacing: 2px;
}
#expiration-date-cartao {
    bottom: 11%;
    left: 9%;
    letter-spacing: 4px;
}
#security-code-cartao {
    bottom: 11%;
    right: 9%;
    letter-spacing: 4px;
}

.issuer {
    position: absolute;
    right: 3%;
    top: 3%;
    width: 15%;
}

</style>