import mongoose, { Schema, Document } from 'mongoose';
import { AddressDoc } from './Address';
import { OrderDoc } from './Order';
import { ProductDoc } from './Product';

interface CustomerDoc extends Document {
    email: string;
    password: string;
    salt: string;
    address: [AddressDoc];
    cart: [any],
    orders: [OrderDoc],
    wishlist: [ProductDoc]
}


const CustomerSchema = new Schema({
    email: String,
    password: String,
    salt: String,
    phone: String,
    address:[
        { type: Schema.Types.ObjectId, ref: 'address', required: true }
    ],
    cart: [
        {
          product: { type: Schema.Types.ObjectId, ref: 'product', required: true},
          unit: { type: Number, required: true}
        }
    ],
    wishlist:[
        { 
            type: Schema.Types.ObjectId, ref: 'product', required: true
        }
    ],
    orders: [ 
        { type: Schema.Types.ObjectId, ref: 'order', required: true }
    ]

},{
    toJSON: {
        transform(doc, ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});


const Customer = mongoose.model<CustomerDoc>('customer', CustomerSchema);

export default Customer