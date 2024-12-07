import { useState, useEffect, useMemo } from "react";
import "./ProductList.css";
import { orderApi, productApi } from "../api/api";
import { Product, Order } from "../types/types";


const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await productApi.getProducts();
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Fetch existing orders
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const fetchedOrders = await orderApi.getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  // Toggle selected items
  const handleCheckboxChange = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Place order function
  const handlePlaceOrder = async () => {
    if (selectedItems.length === 0) {
      alert("Please select at least one product.");
      return;
    }
    
    try {
      setIsLoading(true);
      await orderApi.placeOrder(selectedItems);
      // Refresh orders after placing a new order
      const fetchedOrders = await orderApi.getOrders();
      setOrders(fetchedOrders);
      setSelectedItems([]);
    } catch (error) {
      console.error("Error placing order:", error);
    } finally {
      setIsLoading(false);
    }
  };


  // Sorting orders based on datetime of creation
  const sortedOrders= orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="app-container">
      <div className="products-section">
        <h1 className="section-title">Product Catalog</h1>
        
        <div className="search-container">
          <input 
            type="text"
            placeholder="Search products..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="product-list">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">No products found</div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product._id} className="product-item">
                <label className="product-label">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(product._id)}
                    onChange={() => handleCheckboxChange(product._id)}
                  />
                  <div className="product-details">
                    <span className="product-name">{product.name}</span>
                    <div className="product-meta">
                      <span className="product-price">${product.price}</span>
                      <span className="product-weight">{product.weight}g</span>
                    </div>
                  </div>
                </label>
              </div>
            ))
          )}
        </div>

        <button 
          className="order-button"
          onClick={handlePlaceOrder}
          disabled={selectedItems.length === 0 || isLoading}
        >
          {isLoading ? 'Processing...' : `Place Order (${selectedItems.length})`}
        </button>
      </div>

      <div className="orders-section">
        <h2 className="section-title">Existing Orders</h2>
        
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading orders...</p>
          </div>
        ) : sortedOrders.length > 0 ? (
          <div className="order-list">
            {sortedOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h3 className="order-h3">Order #{order._id.slice(-6)}</h3>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleString()}
                  </span>
                </div>
                {order.packages.map((pkg, pkgIndex) => (
                  <div key={pkgIndex} className="order-package">
                    <div className="package-header">
                      <strong>Package #{pkg.packageNumber}</strong>
                    </div>
                    <div className="package-details">
                      <div className="package-items">
                        <ul>
                          {pkg.items.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="package-stats">
                        <div className="stat">
                          <span>Weight:</span>
                          <span>{pkg.totalWeight}g</span>
                        </div>
                        <div className="stat">
                          <span>Price:</span>
                          <span>${pkg.totalPrice.toFixed(2)}</span>
                        </div>
                        <div className="stat">
                          <span>Courier:</span>
                          <span>${pkg.courierPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">No orders found</div>
        )}
      </div>
    </div>
  );
};

export default ProductList;