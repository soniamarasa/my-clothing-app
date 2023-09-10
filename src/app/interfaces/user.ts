export interface IUser {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
  gender?: string | any;
  birthdate: Date;
  password?: string;
  passwordConfirm?: string;
  imgUrl?: string;
  token?: string;
}

