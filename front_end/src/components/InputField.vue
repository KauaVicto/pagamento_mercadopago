<template>
    <div class="box-input" v-bind:class="{ 'foco': focused }">
        <input :type="type_input" :id="id_input" :value="modelValue" @input="updateModel($event)"
            v-on:focus="focused = true" v-on:blur="handleBlur" v-mascara="mask_input" :maxlength="max_length ? parseInt(max_length) : ''">
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { maskNumberCard, maskCpf, maskDate } from '@/utils/maskInput'


export default defineComponent({
    name: "InputField",
    data() {
        return {
            focused: false
        }
    },
    props: {
        id_input: {
            type: String,
            default: ''
        },
        type_input: {
            type: String,
            default: ''
        },
        modelValue: {
            type: String,
            default: ''
        },
        mask_input: {
            type: String,
            default: ''
        },
        max_length: {
            type: String,
        }
    },
    methods: {
        handleBlur() {

            if (this.modelValue == null)
                return false

            if (this.modelValue.length == 0) {
                this.focused = false
            }
        },
        updateModel(e:any) {
            this.$emit('update:modelValue', e.target.value)
        }
    },
    directives: {
        mascara: {
            mounted(el, binding) {
                const regex = binding.value;
                const inputHandler = (e: any) => {
                    switch (regex) {
                        case 'cardNumber':
                            e.target.value = maskNumberCard(e.target.value)
                            break;

                        case 'cpf':
                            e.target.value = maskCpf(e.target.value)
                            break;
                    
                        case 'date':
                            e.target.value = maskDate(e.target.value)
                            break;

                        default:
                            break;
                    }
                }
                el.addEventListener('input', inputHandler, true);
            }
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
    background-color: rgb(56, 52, 52);
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
    background-color: rgba(56, 52, 52, 0.719);
    transition: .3s all ease-in-out;
    border-radius: 5px 5px 0 0;
    text-transform: uppercase;
}
</style>