import mongoose, { Schema, Document } from "mongoose";

interface IOrder extends Document {
  selectedItems: Array<string>;
  packages: Array<{
    packageNumber: number;
    items: string[];
    totalPrice: number;
    totalWeight: number;
    courierPrice: number;
  }>;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  selectedItems: {
    type: [String],
    required: true,
  },
  packages: [
    {
      packageNumber: { type: Number, required: true },
      items: { type: [String], required: true },
      totalPrice: { type: Number, required: true },
      totalWeight: { type: Number, required: true },
      courierPrice: { type: Number, required: true },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
