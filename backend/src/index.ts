const express = require('express');
const cors = require('cors');
const dbconnection = require('../dbConfig/dbconnect')
import { productRouter } from "./routes/products";
import { userRouter } from "./routes/user";
import { transactionsRouter } from "./routes/transactions";
import { keycoversRouter } from "./routes/keycovers";


const app = express();
const port = 4001;


app.use(express.json())
app.use(cors())  //Allows us to acces our API from the frontend
app.use('/user',userRouter)
app.use('/products',productRouter)
app.use('/keycovers',keycoversRouter)
app.use('/transactions',transactionsRouter)


// Connect to DB and then start the server
const startServer = async () => {
    try {
      await dbconnection(); // Wait for the database connection to be established
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    } catch (error) {
      console.error(
        `Failed to connect to the database. Server not started ${error}`
      );
      process.exit(1); // Exit the process with an error code
    }
  };
  
  startServer()





