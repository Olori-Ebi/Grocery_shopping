import { Request, Response } from "express";
import Customer from "../database/model/Customer";
import { Product } from "../database/model/Product";
import errorResponse from "../utils/errorHandler";
import successResponse from "../utils/response";
import {v4} from 'uuid'
import { Order } from "../database/model/Order";

export default class OrdersController {
  static async createOrder(req: Request, res: Response) {
    try {
        const { id } = req.user;
        const { txnId } = req.body;

        const customer = await Customer.findById(id).populate('cart.product');
        if(customer && customer.cart.length > 0) {
            let amount = 0;
            customer.cart.map(item => {
                amount += (+item.product.price * +item.unit)
            })
            console.log(amount);
            
            const orderId = v4();
        
            const order = new Order({
                orderId,
                customerId: id,
                amount,
                txnId,
                status: 'received',
                items: customer.cart
            })

            customer.cart = [null];
            order.populate('items.product');
            const orderResult = await order.save();
           
            customer.orders.push(orderResult);

            await customer.save();
            return successResponse(res, customer, "Order successfully placed", 200);
        } else {
            return successResponse(res, customer, "You have no product in cart", 200);
        }
    } catch (error: any) {
        return errorResponse(
            res,
            `Error placing order: ${error.message}`,
            400,
            true
          );
    }
  }
}
