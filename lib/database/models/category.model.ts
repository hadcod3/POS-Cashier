import { Document, Schema, model, models } from "mongoose";

export interface IItemCategory extends Document {
    _id: string;
    name: string;
    icon: string;
}

const ItemCategorySchema = new Schema({
  name: { type: String, required: true }, 
  icon: { type: String, required: true },
});
 
const ItemCategory = models.ItemCategory || model("ItemCategory", ItemCategorySchema);
export default ItemCategory; 

