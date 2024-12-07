import mongoose, { Schema, Document } from "mongoose";

interface IProduct extends Document {
  name: string;
  price: number;
  weight: number;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  weight: { type: Number, required: true },
});

const Product = mongoose.model<IProduct>("Product", ProductSchema);
export default Product;
export { IProduct };
