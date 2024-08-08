import express from "express";
import axios from "axios";

const router = express.Router();

let token 

// router.get('/token',(req,res)=>{
//     generateToken()
// })

// Middleware to generate token
const generateToken = async (req, res, next) => {
  const secretKey =
    "AcqvkSeegLGCqk3Bfl6WKACIpghn3ZqaORE1WQBDuCmR7IrEGLgwesY9SmjNcjHN";
  const consumerKey = "XSaStqS2hgq9HTrCUjG0mayRKCEK6bA64In4TFy7D1E8MP6E";
  const auth = Buffer.from(`${consumerKey}:${secretKey}`).toString("base64");
  await axios
    .get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          authorization: `Basic ${auth}`,
        },
      }
    )
    .then((data) => {
      token = data.data.access_token;
      next();
    })
    .catch((error) => {
      console.log(error.message);
    });
};

router.post("/stkpush", generateToken, async (req, res) => {
  const phonenumber = req.body.phonenumber.substring(1);
  const amount = req.body.amount;

  const passkey =
    "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";

  await axios
    .post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: "174379",
        Password:
          "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMTYwMjE2MTY1NjI3",
        Timestamp: "20160216165627",
        TransactionType: "CustomerPayBillOnline",
        Amount: amount,
        PartyA: `254${phonenumber}`,
        PartyB: "174379",
        PhoneNumber: `254${phonenumber}`,
        CallBackURL: "https://ba67-102-68-77-195.ngrok-free.app/callback",
        AccountReference: `254${phonenumber}`,
        TransactionDesc: "Test",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((data) => {
   
      res.status(200).json(data.data);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json(error.message);
    });
});

router.post("/callback",(req,res)=>{
    const responseData = req.body
    console.log(responseData)
})


export { router as transactionsRouter };
