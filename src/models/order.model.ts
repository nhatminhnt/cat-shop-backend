import mongoose, { Schema, Document } from 'mongoose';

interface IOrderItem {
  cat: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  orderItems: IOrderItem[];
  totalPrice: number;
  isPaid: boolean;
  paidAt?: Date;
  status: string; // pending, processing, delivered, canceled
}

const OrderSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderItems: [
      {
        cat: { type: mongoose.Schema.Types.ObjectId, ref: 'Cat', required: true },
        quantity: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    status: { type: String, enum: ['pending', 'processing', 'delivered', 'canceled'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
