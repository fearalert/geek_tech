import { courierCharges, MAX_PRICE } from "../constants";
import { IProduct } from "../models/product";

// Calculate courier cost for given weight
const calculateCourierCharge = (weight: number): number => {
  for (const charge of courierCharges) {
    if (weight <= charge.maxWeight) {
      return charge.charge;
    }
  }
  return Infinity; // Fallback if weight is out of defined ranges
};

// Interface for our calculated package
interface IPackage {
  items: IProduct[];
  totalPrice: number;
  totalWeight: number;
  shippingCost: number;
};

// Main logic for package calculation
const calculatePackages = (products: IProduct[]): IPackage[] => {
  const packages: IPackage[] = [];

  // Sort products by weight descending for better weight balancing
  products.sort((a, b) => b.weight - a.weight);

  for (const product of products) {
    let selectedPackage: IPackage | null = null;

    // Search for the most suitable package with available weight & price room
    for (const pkg of packages) {
      if (pkg.totalPrice + product.price <= MAX_PRICE) {
        if (!selectedPackage || Math.abs(pkg.totalWeight - (pkg.totalWeight + product.weight)) < Math.abs(selectedPackage.totalWeight - (selectedPackage.totalWeight + product.weight))) {
          selectedPackage = pkg;
        }
      }
    }

    if (selectedPackage) {
      // Add item to the most appropriate package
      selectedPackage.items.push(product);
      selectedPackage.totalPrice += product.price;
      selectedPackage.totalWeight += product.weight;
      selectedPackage.shippingCost = calculateCourierCharge(selectedPackage.totalWeight);
    } else {
      // Create a new package if no suitable one is found
      packages.push({
        items: [product],
        totalPrice: product.price,
        totalWeight: product.weight,
        shippingCost: calculateCourierCharge(product.weight),
      });
    }
  }

  // Sort the packages by their weight for better distribution
  packages.sort((a, b) => a.totalWeight - b.totalWeight);

  return packages;
};

export { calculatePackages };
