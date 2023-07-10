<template>
    <div class="box-input" v-bind:class="{'foco': focused}">
        <input :type="type_input" :id="id_input" v-on:focus="focused = true" v-on:blur="focused = false">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';


export default defineComponent({
    name: "InputField",
    data() {
        return {
            focused: false
        }
    },
    props: ['id_input', 'type_input']
});

</script>

<style scoped>
.box-input {
    width: 100%;
    position: relative;
}

.box-input::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: black;
    transition: .3s all ease-in-out;
}

.box-input.foco::after {
    width: 70%;
}

.box-input input {
  padding: 10px;
  width: 100%;
  margin: 5px 0;
  border: none;
  outline: none;
  position: relative;
  display: block;
}
</style>