import express, { Request, Response } from "express";
import Customer from "../controllers/customer.controller";
import { validateAddressRequest, validateSigninRequest, validateSignupRequest } from "../middleware/request";
import { verifyUser } from '../middleware/authentication'

const customerRouter = express.Router();

customerRouter.get("/", (_req: Request, res: Response) => {
  res.send('Welcome')
});

customerRouter.post("/customer/signup", validateSignupRequest, Customer.signup);
customerRouter.post("/customer/signin", validateSigninRequest, Customer.signin);
customerRouter.post("/customer/address", validateAddressRequest, verifyUser, Customer.addAddress);
customerRouter.get("/customer/profile", verifyUser, Customer.getProfile);
customerRouter.get("/customer/wishlist", verifyUser, Customer.getWishlist);


export default customerRouter;