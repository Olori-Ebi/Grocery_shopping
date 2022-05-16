import { Request, Response } from "express";
import Customer from "../database/model/Customer";
import { Product } from "../database/model/Product";
import errorResponse from "../utils/errorHandler";
import successResponse from "../utils/response";

export default class ProductController {
  static async createProduct(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const customer = await Customer.findById(id);
      if (!customer)
        return errorResponse(
          res,
          "Sorry. Only registered users can create a product",
          403,
          true
        );
      const { name, desc, type, unit, price, available, supplier, banner } =
        req.body;
      const product = new Product({
        name,
        desc,
        type,
        unit,
        price,
        available,
        supplier,
        banner,
      });
      await product.save();
      return successResponse(res, product, "Product created successfully", 201);
    } catch (error: any) {
      return errorResponse(
        res,
        `Error creating a product. ${error.message}`,
        400,
        true
      );
    }
  }

  static async getProducts(_req: Request, res: Response) {
    try {
      const product = await Product.find();
      return successResponse(
        res,
        product,
        "Products fetched successfully",
        200
      );
    } catch (error: any) {
      return errorResponse(
        res,
        `Error fetching products. ${error.message}`,
        400,
        true
      );
    }
  }

  static async getProductCategory(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const product = await Product.find({ type });
      return successResponse(
        res,
        product,
        `Product of type ${type} fetched successfully`,
        200
      );
    } catch (error: any) {
      return errorResponse(
        res,
        `Error fetching products. ${error.message}`,
        400,
        true
      );
    }
  }

  static async addProductToWishlist(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const customer = await Customer.findById(id);
      if (!customer)
        return errorResponse(res, "Sorry. Only registered users can add a product to wishlist", 403, true);
      const { productId } = req.body;
      const product = await Product.findById(productId);
      if (!product)
        return errorResponse(res, "Sorry. Product not found", 404, true);
      
      if(customer.wishlist.length > 0) {
          let isExist = false;
          const productIndex = customer.wishlist.findIndex(list => list._id == productId);
          if(productIndex > -1) {
            customer.wishlist.splice(productIndex, 1);
            isExist = true;
          } else if(!isExist) {
            customer.wishlist.push(product);
          }
      } else {
        customer.wishlist.push(product);
      }
      
      await customer.save();
      return successResponse(res, customer, "Product added to wishlist successfully", 200);
    } catch (error: any) {
      return errorResponse(
        res,
        `Error adding product to wishlist: ${error.message}`,
        400,
        true
      );
    }
  }

  static async addProductToCart(req: Request, res: Response) {
    try {
        const { id } = req.user;
        const customer = await Customer.findById(id);
        if (!customer)
          return errorResponse(res, "Sorry. Only registered users can add a product to cart", 403, true);
        const { productId, quantity, isRemove } = req.body;
        const product = await Product.findById(productId);
        
        if (!product)
          return errorResponse(res, "Sorry. Product not found", 404, true);
        
          if(customer.cart.length > 0){
            let isExist = false;
             customer.cart.map(item => {
                if(item.product._id.toString() === product._id.toString()){
                    if(isRemove){
                        customer.cart.splice(customer.cart.indexOf(item), 1);
                    } else {
                        item.unit = quantity;
                    }
                    isExist = true;
                }
            });

            if(!isExist){
                customer.cart.push({product, unit: quantity});
            } 
        }else{
            customer.cart.push({product, unit: quantity});
        }
        
        await customer.save();
        return successResponse(res, customer.cart, "Product added to cart successfully", 200);
      } catch (error: any) {
        return errorResponse(
          res,
          `Error adding product to cart: ${error.message}`,
          400,
          true
        );
      }
  }
}
