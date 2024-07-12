import { Schema, model } from "mongoose";

export interface IUser {
  _id?: string;
  username: string;
  password: string;
  availableMoney: number
  createdAt?: Date;
  updatedAt?: Date;
  purchaseItems:string[];
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password:{type:String,required:true},
  availableMoney:{type:Number,default:100000},
  purchaseItems:[{type:Schema.Types.ObjectId,ref:"product",default:[]}]
},{ timestamps: true });

export const UserModel = model<IUser>('user',UserSchema)
