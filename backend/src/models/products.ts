import {Schema,model} from 'mongoose'

export interface Iproduct {
    productName: string,
    productPrice: number,
    productDescription: string,
    imageURL:string,
    stockQuantity:number
}
const productSchema = new Schema<Iproduct>({
    productName: {type: String, required: true},
    productPrice: {type: Number, required: true,min:[1,'Min price is 200.']},
    productDescription: {type: String, required: true},
    imageURL:{type:String,},
    stockQuantity:{type:Number,required:true,min:[0,'Stock cant be lower than 0.']}

},{timestamps:true})

export const productModel = model<Iproduct>("products",productSchema)