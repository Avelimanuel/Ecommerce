import {Router} from 'express'
import { KeycoversModel } from '../models/keycovers';

const router = Router();

router.get('/',async(req,res)=>{
    try {
        const keycovers = await KeycoversModel.find({})
        return res.json({ keycovers });
    } catch (error) {
        console.log(`Error in finding key covers ${error}`);
        
    }
})

export {router as keycoversRouter}