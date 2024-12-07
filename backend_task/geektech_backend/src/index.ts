import express from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import productRoutes from "./routes/product.routes";
import bodyParser from "body-parser";
import {connection} from "./db/connection";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/orders", orderRoutes);
app.use("/api/products", productRoutes);

app.use(bodyParser.json())

connection();

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
