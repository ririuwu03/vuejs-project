// productService.js

// Example data (can be replaced with API calls to backend)
let products = [
    { id: 1, name: 'Product 1', description: 'Description 1', price: 10, stockQuantity: 100 },
    { id: 2, name: 'Product 2', description: 'Description 2', price: 20, stockQuantity: 200 },
    { id: 3, name: 'Product 3', description: 'Description 3', price: 30, stockQuantity: 300 }
  ];
  
  // Generate a unique ID for new products
  function generateId() {
    return products.length > 0 ? Math.max(...products.map(product => product.id)) + 1 : 1;
  }
  
  // Service methods
  export default {
    // Get all products
    getAllProducts() {
      return products;
    },
  
    // Get product by ID
    getProductById(id) {
      return products.find(product => product.id === id);
    },
  
    // Add a new product
    addProduct(product) {
      const newProduct = { id: generateId(), ...product };
      products.push(newProduct);
      return newProduct;
    },
  
    // Update an existing product
    updateProduct(id, updatedProduct) {
      const index = products.findIndex(product => product.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        return products[index];
      }
      return null; // Product not found
    },
  
    // Delete a product by ID
    deleteProduct(id) {
      const index = products.findIndex(product => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        return true; // Deletion successful
      }
      return false; // Product not found
    }
  };
  