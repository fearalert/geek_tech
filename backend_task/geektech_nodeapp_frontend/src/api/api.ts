import axios from 'axios';

// Base URL for API calls
const BASE_URL = 'http://localhost:5000/api';

// Product-related API calls
export const productApi = {
  /**
   * Fetch all products
   * @returns Promise resolving to an array of products
   */
  getProducts: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/products/get`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
};

// Order-related API calls
export const orderApi = {
  /**
   * Fetch existing orders
   * @returns Promise resolving to an array of orders
   */
  getOrders: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/get-orders`);
      return response.data;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  /**
   * Place a new order
   * @param selectedItems Array of selected product IDs
   * @returns Promise resolving to the placed order
   */
  placeOrder: async (selectedItems: string[]) => {
    try {
      const response = await axios.post(`${BASE_URL}/orders/place-order`, {
        selectedItems,
      });
      return response.data;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  },
};