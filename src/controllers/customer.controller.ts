import { Request, Response } from "express";
import { Address } from "../database/model/Address";
import Customer from "../database/model/Customer";
import { comparePassword, generateToken, hashedPassword } from "../utils/auth";
import errorResponse from "../utils/errorHandler";
import successResponse from "../utils/response";

export default class CustomerController {
  static async signup(req: Request, res: Response) {
    const { email, password, phone } = req.body;
    let userExist = await Customer.findOne({ email });
    if (userExist) return errorResponse(res, "Email is taken", 409, true);

    const hashed = hashedPassword(password);

    const customer = new Customer({
      phone,
      email,
      password: hashed,
    });

    const token = generateToken({ id: customer._id, email, phone });
    await customer.save();

    return successResponse(
      res,
      { customer, token },
      "customer created successfully",
      201
    );
  }

  static async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      let user = await Customer.findOne({ email });
      if (user && comparePassword(password, user.password)) {
        const token = generateToken({ id: user._id, email });
        return successResponse(
          res,
          { user, token },
          "customer logged in successfully",
          200
        );
      }
      return errorResponse(res, "Invalid credentials", 400, true);
    } catch (error:any) {
      return errorResponse(res, `Error logging in. ${error.message}`, 400, true);
    }
  }

  static async addAddress(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { street, postalCode, city, country } = req.body;
  
      const customer = await Customer.findById(id);
  
      if (!customer) return errorResponse(res, "Customer not found", 404, true);
      const address = new Address({ street, postalCode, city, country });
      customer.address.push(address);
      await customer.save();
      await address.save();
      return successResponse(res, customer, "Address added successfully", 200);
    } catch (error:any) {
      return errorResponse(res, `Error adding address. ${error.message}`, 400, true);
    }
  }

  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const customer = await Customer.findById(id)
      .populate("address")
      .populate("wishlist")
      // .populate("orders")
      .populate("cart.product");

      return successResponse(res, customer, "Profile fetched successfully", 200);
    } catch (error: any) {
      return errorResponse(res, `Error fetching profile. ${error.message}`, 400, true);
    }
  }

  static async getWishlist(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const customer = await Customer.findById(id).populate('wishlist');
      return successResponse(res, customer && customer.wishlist, "Wishlist fetched successfully", 200);
    } catch (error: any) {
      return errorResponse(res, `Error fetching wishlist. ${error.message}`, 400, true);
    }
  }
}
