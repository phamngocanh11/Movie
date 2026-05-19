const mongoose = require("mongoose");
require("dotenv").config();
const logger = require("./logger");

mongoose.set("strictQuery", false);

const connectString = process.env.DB_URL;

const connectToDB = async () => {
  try {
    await mongoose.connect(connectString);
    logger.info("Da ket noi voi MongoDB");
  } catch (error) {
    logger.error(`Loi khi ket noi voi MongoDB: ${error.message}`);
  }
};

module.exports = {
  connectToDB,
};
