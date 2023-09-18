import { ICategory } from './category';

export interface IAccessory {
  _id?: string;
  name?: string;
  userId?: string;
  color?: string;
  categoria?: ICategory;
}
