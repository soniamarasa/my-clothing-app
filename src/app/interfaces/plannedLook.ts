import { IClothing } from './clothing';
import { IHandbag } from './handbag';
import { ILook } from './look';
import { IPlace } from './place';
import { ITag } from './tag';

export interface IPlannedLook {
  _id?: string;
  userId?: string;
  look: ILook;
  coat: IClothing;
  handbag: IHandbag;
  date: Date;
  status: string;
  place: IPlace;
  tag: ITag;
}
