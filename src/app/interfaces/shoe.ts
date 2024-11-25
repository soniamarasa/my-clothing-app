import { ICategory } from './category';

export interface IShoe {
  _id?: string;
  userId?: string;
  name?: string;
  color?: string;
  categoria?: ICategory;
}
