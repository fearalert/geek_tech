import { Router } from "express";
import { getOrders, placeOrder } from "../controllers/order.controller";

const router = Router();

router.post("/place-order", placeOrder as any);
router.get("/get-orders", getOrders);

export default router;
