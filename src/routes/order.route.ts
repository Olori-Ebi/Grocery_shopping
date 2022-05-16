import express from "express";
import OrdersController from "../controllers/order.controller";
import { verifyUser } from '../middleware/authentication';
import { validateProductRequest } from "../middleware/request";

const orderRouter = express.Router();

orderRouter.post("/order/create", verifyUser, OrdersController.createOrder);


export default orderRouter;