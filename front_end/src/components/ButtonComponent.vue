<template>
    <input :type="type_button" :value="text_button">
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name: "ButtonComponent",
    props: {
        text_button: {
            type: String,
            default: ''
        },
        type_button: {
            type: String,
            default: 'button'
        }
    }
});

</script>

<style scoped>
input {
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