const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

module.exports = async function (callback) {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Connected to MongoDB");

    const foodCollection = mongoose.connection.db.collection("food_items");
    const categoryCollection = mongoose.connection.db.collection("Categories");

    const foodData = await foodCollection.find({}).toArray();
    const catData = await categoryCollection.find({}).toArray();

    callback(null, foodData, catData);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    callback(err, null, null);
  }
};
