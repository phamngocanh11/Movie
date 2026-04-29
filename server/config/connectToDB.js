const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);

const connectString = process.env.DB_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(connectString);
    console.log("Da ket noi voi MongoDB");
  } catch (error) {
    console.error("Loi khi ket noi voi MongoDB: ", error);
  }
};

module.exports = {
  connectToDB,
};
