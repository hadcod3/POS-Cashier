import { Document, Schema, model, models } from "mongoose";

export interface IVariant extends Document {
  name: string;
  options: {
    label: string;
    price: number;
  }[];
}

const VariantSchema = new Schema({
  name: { type: String, required: true },
  options: [{
    label: { type: String, required: true },
    price: { type: Number, required: true }
  }]
});

export interface IItem extends Document {
    _id: string;
    name: string;
    imgUrl: string;
    price: number;
    stock: boolean;
    minOrder: number;
    category: { 
        _id: string; 
        name: string; 
        icon: string;
    };
    variants?: IVariant[];
    createdAt: string;
    updatedAt: string;
}

const ItemSchema = new Schema({
    name: { type: String, required: true },
    imgUrl: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Boolean, default: true },
    minOrder: { type: Number, default: 1, min: 1 },
    category: { type: Schema.Types.ObjectId, ref: 'ItemCategory', required: true },
    variants: [VariantSchema]
    }, { 
    timestamps: true 
});

export const Item = models.Item || model<IItem>('Item', ItemSchema);