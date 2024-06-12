import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';

const productService = {
  getAllProducts: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  createProduct: async (product) => {
    const response = await axios.post(API_URL, product);
    return response.data;
  },
  deleteProduct: async (productId) => {
    const response = await axios.delete(`${API_URL}/${productId}`);
    return response.data;
  }
};

export default productService;
