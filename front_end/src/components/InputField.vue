<template>
    <div class="box-input" v-bind:class="{ 'foco': focused }">
        <input :type="type_input" :id="id_input" :value="modelValue" @input="updateModel($event.target.value)"
            v-on:focus="focused = true" v-on:blur="handleBlur"> 
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
    props: {
        id_input: String, 
        type_input: String,
        modelValue: String
    },
    methods: {
        handleBlur() {
            if (!this.modelValue)
                return false
            
            if (this.modelValue.length == 0) {
                this.focused = false
            }
        },
        updateModel(value: any) {
            this.$emit('update:modelValue', value)
        }
    }
});

</script>

<style scoped>
.box-input {
    position: relative;
    display: block;
    margin: 10px;
}

.box-input::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0%;
    height: 2px;
    background-color: #087bdf;
    transition: .3s all ease-in-out;
}

.box-input.foco input {
    background-color: rgb(240, 240, 240);
}

.box-input.foco::after {
    width: 100%;
}

.box-input input {
    padding: 10px;
    width: 100%;
    margin: 5px 0;
    border: none;
    outline: none;
    position: relative;
    display: block;
    background-color: white;
    transition: .3s all ease-in-out;
    border-radius: 5px 5px 0 0;
    text-transform: uppercase;
}
</style>