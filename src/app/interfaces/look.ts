import { IAccessory } from "./accessory";
import { IClothing } from "./clothing";
import { IShoe } from "./shoe";

export interface ILook {
  _id?: string;
  userId?: string;
  top: IClothing | null;
  bottom: IClothing | null;
  dress: IClothing | null;
  coat: IClothing | null;
  shoe: IShoe | null;
  accessory: IAccessory | null;
  handbag: IAccessory | null;
  bandana: IAccessory | null;
}
