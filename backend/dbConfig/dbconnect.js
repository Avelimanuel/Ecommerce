const mongoose = require('mongoose');

const dburl = "mongodb+srv://pedro:mongo123@workout.quuwb8r.mongodb.net/?retryWrites=true&w=majority&appName=WorkOut"

const dbconnection = async () => {
    try {
      await mongoose.connect(dburl);
      console.log("Database connection was successful");
    } catch (error) {
      console.error(`${error}`);
      throw error; // Re-throw the error to be handled in the main file
    }
  };

  module.exports = dbconnection