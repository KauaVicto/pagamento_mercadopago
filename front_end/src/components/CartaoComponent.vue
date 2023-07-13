<template>
    <div class="cartao" v-on:mouseover="console.log(numero_cartao)" :class="{ 'master': issuer == 'master', 'visa': issuer == 'visa' }">
        <p id="text-titular">{{ titular.length > 0 ? titular : 'NOME DO TITULAR' }}</p>
        <p id="numero-cartao">{{ numero_cartao.length > 0 ? numero_cartao : '**** **** **** ****' }}</p>
        <p id="validade-cartao">{{ validade_cartao.length > 0 ? validade_cartao : '**/**' }}</p>
        <img class="issuer" v-show="issuer" :src="caminhoImagem" alt="">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name: "CartaoComponent",
    props: {
        titular: {
            type: String,
            default: ''
        },
        numero_cartao: {
            type: String,
            default: ''
        },
        validade_cartao: {
            type: String,
            default: ''
        },
        issuer: {
            type: String
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
    color: black;
    text-transform: uppercase;
    font-size: 60%;
    transition: .3s all ease-in-out;
}

.cartao.master {
    background-image: url('@/assets/cartao.png'), linear-gradient(45deg, rgb(167, 116, 7), rgb(199, 138, 8), rgb(167, 116, 7));
    color: white;
}

.cartao.visa {
    background-image: url('@/assets/cartao.png'), linear-gradient(45deg, rgb(34, 68, 119), rgb(17, 56, 116), rgb(34, 68, 119));
    color: white;
}

.cartao p {
    position: absolute;
    font-size: 2em;
    font-weight: 600;
}

#text-titular {
    bottom: 10px;
    left: 10px;
}

#numero-cartao {
    bottom: 50px;
    left: 10px;
    letter-spacing: 4px;
}
#validade-cartao {
    bottom: 10px;
    right: 10px;
}

.issuer {
    position: absolute;
    right: 10px;
    top: 10px;
    width: 15%;
}

</style>