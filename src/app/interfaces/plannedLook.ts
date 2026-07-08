import { IAccessory } from './accessory';
import { IBandana } from './bandana';
import { IClothing } from './clothing';
import { IHandbag } from './handbag';
import { ILook } from './look';
import { IPlace } from './place';

export interface IPlannedLook {
  _id?: string;
  userId?: string;
  look: ILook;
  coat: IClothing;
  handbag: IHandbag;
  date: Date;
  status: { name: string; id: number } | string;
  place: IPlace;

  accessories: IAccessory[];
  bandana: IBandana | null;
}
