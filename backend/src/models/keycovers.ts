import { Schema,model } from "mongoose";

export interface Ikeycovers{
    productName: string,
    productPrice: number,
    productDescription: string,
    imageURL:string,
    stockQuantity:number
}

const keycoversSchema = new Schema<Ikeycovers>({
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true,min:[300,'Product price lower than ksh.300'] },
    productDescription: { type: String, required: true },
    imageURL: { type: String, required: true },
    stockQuantity: { type: Number, required: true ,min:[0,'Stock cannot be lower than 0']}
},{timestamps:true})

export const KeycoversModel = model<Ikeycovers>('keycover',keycoversSchema)