<template>
    <button>{{ text_button }}</button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name: "ButtonComponent",
    props: ['text_button']
});

</script>

<style scoped>
button {
    padding: 10px;
    background-color: #2f96f0;
    border: none;
    border-radius: 5px;
    color: white;
    font-weight: 600;
    margin: 10px 0;
    transition: .3s all ease-in-out;
    cursor: pointer;
}

button:hover {
    background-color: #156fbe;
}
</style>