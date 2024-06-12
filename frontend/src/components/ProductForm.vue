<template>
  <div>
    <h2>Add Product</h2>
    <form @submit.prevent="submitForm">
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="formData.name" required>
      <label for="description">Description:</label>
      <input type="text" id="description" v-model="formData.description" required>
      <label for="price">Price:</label>
      <input type="number" id="price" v-model.number="formData.price" required>
      <label for="stock">Stock Quantity:</label>
      <input type="number" id="stock" v-model.number="formData.stock" required>
      <button type="submit">Add Product</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'ProductForm',
  data() {
    return {
      formData: {
        name: '',
        description: '',
        price: null,
        stock: null
      }
    };
  },
  methods: {
    submitForm() {
      this.$emit('add', this.formData);
      this.formData = {
        name: '',
        description: '',
        price: null,
        stock: null
      };
    }
  }
};
</script>





  