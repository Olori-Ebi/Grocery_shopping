import express from "express";
import { verifyUser } from '../middleware/authentication'
import ProductController from "../controllers/product.controller";
import { validateProductRequest } from "../middleware/request";

const productRouter = express.Router();

productRouter.post("/product/create", validateProductRequest, verifyUser, ProductController.createProduct);
productRouter.get("/product/category/:type", verifyUser, ProductController.getProductCategory);
productRouter.get("/products", verifyUser, ProductController.getProducts);
productRouter.put("/product/wishlist", verifyUser, ProductController.addProductToWishlist);
productRouter.put("/product/cart", verifyUser, ProductController.addProductToCart);

export default productRouter;