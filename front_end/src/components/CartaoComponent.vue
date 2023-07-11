<template>
    <div class="cartao">
        <p id="text-titular">{{ titular }}</p>
        <p id="numero-cartao">{{ numero_cartao }}</p>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name: "CartaoComponent",
    props: {
        titular: {
            type: String,
            default: 'NOME DO TITULAR'
        },
        numero_cartao: {
            type: String,
            default: '**** **** **** ****'
        }
    }
});

</script>

<style scoped>
.cartao {
    position: relative;
    background-image: url('@/assets/cartao.png'), linear-gradient(45deg, rgb(15, 40, 78), rgb(17, 56, 116), rgb(15, 40, 78));
    background-size: cover;
    width: 100%;
    aspect-ratio: 16 / 10;
    border: 1px solid black;
    border-radius: 10px;
    color: white;
    text-transform: uppercase;
}
.cartao p {
    position: absolute;
}
#text-titular {
    bottom: 20px;
    left: 10px;
}
#numero-cartao {
    bottom: 50px;
    left: 10px;
    letter-spacing: 4px;
}
</style>