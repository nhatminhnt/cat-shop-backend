import mongoose, { Schema, Document } from "mongoose";

export interface ICat extends Document {
  name: string;
  price: number;
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
}

const CatSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    breed: { type: String, required: true },
    age: { type: Number, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ICat>("Cat", CatSchema);


