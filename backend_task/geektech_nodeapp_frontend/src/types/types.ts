interface Product {
    _id: string;
    name: string;
    price: number;
    weight: number;
  }
  
  interface OrderPackage {
    packageNumber: number;
    items: string[];
    totalPrice: number;
    totalWeight: number;
    courierPrice: number;
  }
  
  interface Order {
    _id: string;
    selectedItems: string[];
    packages: OrderPackage[];
    createdAt: string;
  }

export type { Product, Order };