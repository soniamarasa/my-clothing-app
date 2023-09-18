import { ICategory } from "./category";
import { ITag } from "./tag";

export interface IClothing {
  _id?: string;
  userId?: string;
  name?: string;
  color?: string;
  inactive: Boolean;
  category: ICategory,
  tag: ITag,
}
