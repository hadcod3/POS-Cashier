import { IVariant } from "@/lib/database/models/item.model";
import { IItem } from '@/lib/database/models/item.model'

export type CreateItemParams = {
  name: string;
  imgUrl: string;
  price: number;
  stock: boolean;
  minOrder: number;
  category: string;
  variants?: IVariant[];
};

export type UpdateItemParams = CreateItemParams & {
  _id: string;
};

export interface VariantOption {
  label: string;
  price: number;
}

export interface FormVariant {
  name: string;
  options: VariantOption[];
}

export interface CartEntry {
  item: IItem
  quantity: number
  variantLabel?: string
  variantPrice?: number;
}