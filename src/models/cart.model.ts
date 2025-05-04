import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  cat: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  cartItems: ICartItem[];
}

const CartSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cartItems: [
      {
        cat: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true },
        quantity: { type: Number, required: true, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICart>('Cart', CartSchema);
