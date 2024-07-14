


import {ApiService} from '../ApiService';

export const ProductEndpoint = {
  
  getProduct: () => ApiService.get('product'),
  createProduct: (userData) => ApiService.post('product', userData),
  updateProduct: (id, userData) => ApiService.put(`product/${id}`, userData),
  deleteProduct: (id) => ApiService.delete(`product/${id}`),

  searchProduct: (searchQuery) => ApiService.get(`product/search?query=${searchQuery}`),
};