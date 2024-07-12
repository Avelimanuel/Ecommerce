import { Router } from "express";
import { productModel } from "../models/products";
import { verifyTokens } from "./user";
import { UserModel } from "../models/user";

const router = Router();

router.get("/",async (req, res) => {
  try {
    const products = await productModel.find({});
    return res.json({ products });
  } catch (error) {
    console.log(error);
  }
});

router.post("/checkout",verifyTokens,  async (req, res) => {
  const { customerId, cartItems } = req.body;
  try {
    const user = await UserModel.findById(customerId);
    const productIDs = Object.keys(cartItems);
    const products = await productModel.find({ _id: { $in: productIDs } });

    //Error handling
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    if (!products) {
      return res.status(400).json({ message: "Product/s not found" });
    }
    if (products.length !== productIDs.length) {
      return res.status(400).json({ message: "Some products were not found" });
    }
    //End of error handling
    let totalPrice = 0;
    for(const item in cartItems){
        const product = products.find((product)=>String(product._id) === item)
        if(!product){
            return res.status(400).json({message: "Product not found" })
        }
        if(product.stockQuantity < cartItems[item]){
            return res.status(400).json({message: "Not enough stock" })
        }
        totalPrice += product.productPrice * cartItems[item]

        if(user.availableMoney < totalPrice){
            return res.status(400).json({message: "Not enough money" })
        }
        user.availableMoney -= totalPrice
        user.purchaseItems.push(...productIDs)
        await user.save()
        await productModel.updateMany({_id:{$in:productIDs}},{$inc:{stockQuantity:-1}})
        res.json(({purchasedItems:user.purchaseItems}))
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router as productRouter };
