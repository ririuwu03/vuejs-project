<template>
  <div>
    <h1>Product Dashboard</h1>
    <form @submit.prevent="addProduct" class="product-form">
      <input v-model="newProduct.name" placeholder="Name" required />
      <input v-model="newProduct.description" placeholder="Description" required />
      <input v-model.number="newProduct.price" placeholder="Price" type="number" required />
      <input v-model.number="newProduct.quantity" placeholder="Quantity" type="number" required />
      <button type="submit">Add Product</button>
    </form>

    <table class="product-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>{{ product.name }}</td>
          <td>{{ product.description }}</td>
          <td>{{ product.price }}</td>
          <td>{{ product.quantity }}</td>
          <td>
            <button @click="editProduct(product)">Edit</button>
            <button @click="deleteProduct(product.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="editingProduct" class="edit-form">
      <h2>Edit Product</h2>
      <form @submit.prevent="updateProduct">
        <input v-model="editingProduct.name" placeholder="Name" required />
        <input v-model="editingProduct.description" placeholder="Description" required />
        <input v-model.number="editingProduct.price" placeholder="Price" type="number" required />
        <input v-model.number="editingProduct.quantity" placeholder="Quantity" type="number" required />
        <button type="submit">Update Product</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductDashboard",
  data() {
    return {
      products: [],
      newProduct: {
        name: "",
        description: "",
        price: 0,
        quantity: 0,
      },
      editingProduct: null,
      websocket: null,
    };
  },
  methods: {
    fetchProducts() {
      fetch("http://localhost:3000/products")
        .then((response) => response.json())
        .then((data) => {
          this.products = data;
        })
        .catch((error) => console.error("Error fetching products:", error));
    },
    addProduct() {
      fetch("http://localhost:3000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.newProduct),
      })
        .then((response) => response.json())
        .then(() => {
          this.newProduct = { name: "", description: "", price: 0, quantity: 0 };
          this.fetchProducts();
        })
        .catch((error) => console.error("Error adding product:", error));
    },
    updateProduct() {
      fetch(`http://localhost:3000/products/${this.editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.editingProduct),
      })
        .then((response) => response.json())
        .then(() => {
          this.editingProduct = null;
          this.fetchProducts();
        })
        .catch((error) => console.error("Error updating product:", error));
    },
    deleteProduct(productId) {
      fetch(`http://localhost:3000/products/${productId}`, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          this.fetchProducts();
        })
        .catch((error) => console.error("Error deleting product:", error));
    },
    editProduct(product) {
      this.editingProduct = { ...product };
    },
    cancelEdit() {
      this.editingProduct = null;
    },
    handleWebSocketMessage(event) {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "ADD": {
          this.products.push(message.product);
          break;
        }
        case "UPDATE": {
          const index = this.products.findIndex((p) => p.id === message.product.id);
          if (index !== -1) {
            this.$set(this.products, index, message.product);
          }
          break;
        }
        case "DELETE": {
          const index = this.products.findIndex((p) => p.id === message.id);
          if (index !== -1) {
            this.products.splice(index, 1);
          }
          break;
        }
        default:
          break;
      }
    },
    connectWebSocket() {
      this.websocket = new WebSocket("ws://localhost:3000");
      this.websocket.onmessage = this.handleWebSocketMessage;
    },
  },
  created() {
    this.fetchProducts();
    this.connectWebSocket();
  },
  beforeUnmount() {
    if (this.websocket) {
      this.websocket.close();
    }
  },
};
</script>

<style scoped>
/* Your styles here */
.product-form {
  margin-bottom: 20px;
}

.product-form input {
  margin-right: 10px;
}

.product-table {
  width: 100%;
  border-collapse: collapse;
}

.product-table th, .product-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.product-table th {
  background-color: #f2f2f2;
}

.edit-form {
  margin-top: 20px;
}

.edit-form form {
  display: flex;
  flex-direction: column;
}

.edit-form input {
  margin-bottom: 10px;
}
</style>
