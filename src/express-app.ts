import express, { Application, Response } from "express";
import customerRouter from "./routes/customer.route";
import orderRouter from "./routes/order.route";
import productRouter from "./routes/product.route";

export default async(app: Application) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true}))
    
    app.use(express.json());

    app.use('/', customerRouter)
    app.use('/', productRouter)
    app.use('/', orderRouter)

    app.use('*', (_req, res: Response) => {
        res.status(404).json({
          success: false,
          message: 'Page not found',
          error: {
            statusCode: 404,
            message: 'You reached a route that is not defined on this server',
          },
        });
      });
 
    return app;
}
