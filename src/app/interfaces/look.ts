import { IAccessory } from "./accessory";
import { IBandana } from "./bandana";
import { IClothing } from "./clothing";
import { IShoe } from "./shoe";

export interface ILook {
  _id?: string;
  userId?: string;
  top: IClothing | null;
  bottom: IClothing | null;
  dress: IClothing | null;
  shoe: IShoe | null;
  accessories: IAccessory[];
  bandana: IBandana | null;
}
