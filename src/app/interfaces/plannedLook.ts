import { ILook } from './look';
import { IPlace } from './place';
import { ITag } from './tag';

export interface IPlannedLook {
  _id?: string;
  userId?: string;
  look: ILook;
  date: Date;
  status: string;
  place: IPlace;
  tag: ITag;
}
