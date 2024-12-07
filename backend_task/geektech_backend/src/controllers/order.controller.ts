import { Request, Response } from "express";
import Product from "../models/product";
import { calculatePackages } from "../utils/calculate.package";
import Order from "../models/order";

export const placeOrder = async (req: Request, res: Response) => {
    const { selectedItems } = req.body;
  
    if (!selectedItems || !Array.isArray(selectedItems)) {
      return res.status(400).json({ message: "Invalid request. Selected items are required." });
    }
  
    try {
      const products = await Product.find({ _id: { $in: selectedItems } });
  
      if (products.length === 0) {
        return res.status(404).json({ message: "No products found for the given IDs." });
      }
  
      const packages = calculatePackages(products);
  
      const result = packages.map((pkg, index) => ({
        packageNumber: index + 1,
        items: pkg.items.map((item) => item.name),
        totalPrice: pkg.totalPrice,
        totalWeight: pkg.totalWeight,
        courierPrice: 15,
      }));
  
      const newOrder = new Order({
        selectedItems,
        packages: result,
      });
  
      await newOrder.save();
  
      res.status(200).json(result);
    } catch (error) {
      console.error("Error placing order:", error);
      res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  };

export const getOrders = async (req: Request, res: Response) => {
    try {
      const orders = await Order.find();
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Internal server error. Please try again later." });
    }
  };