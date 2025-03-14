import { IAccessory } from './accessory';
import { IBandana } from './bandana';
import { IClothing } from './clothing';
import { IShoe } from './shoe';
import { ITag } from './tag';

export interface ILook {
  _id?: string;
  userId?: string;
  top: IClothing | null;
  bottom: IClothing | null;
  garb: IClothing | null;
  shoe: IShoe | null;
  tag: ITag;
}
