const express = require("express");
const User = require("../models/User");
const Order = require("../models/Orders");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const axios = require("axios");
const fetch = require("../middleware/fetchdetails");
const jwtSecret = process.env.JWT_SECRET;

//
// 🔐 CREATE USER
//
router.post(
  "/createuser",
  [
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
    body("name").isLength({ min: 3 }),
  ],
  async (req, res) => {
    try {
      let success = false;

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.array()[0].msg });
      }
      const { name, email, password, location } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success,
          error: "Email already registered",
        });
      }

      const salt = await bcrypt.genSalt(10);
      let securePass = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        password: securePass,
        email,
        location,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, jwtSecret);

      success = true;
      return res.status(201).json({ success, authToken });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        error: "Server error, please try again later",
      });
    }
  },
);

//
// 🔐 LOGIN USER
//
router.post(
  "/login",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email }); //{email:email} === {email}
      if (!user) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success, error: "Try Logging in with correct credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      success = true;
      const authToken = jwt.sign(data, jwtSecret);
      res.json({ success, authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  },
);

// Get logged-in User details using token, Login Required.
router.post("/getuser", fetch, async (req, res) => {
  try {
    // user id comes from middleware (JWT decoded)
    const userId = req.user.id;
    // find user from DB (exclude password)
    const user = await User.findById(userId).select("-password");

    // ❗ if user not found
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // send user data
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("GetUser Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

//
// 📍 GET LOCATION (Move API key to .env later)
//
router.post("/getlocation", async (req, res) => {
  try {
    const { lat, long } = req.body.latlong;

    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${process.env.GEO_API_KEY}`,
    );

    let data = response.data.results[0].components;
    const location = `${data.village || ""}, ${data.county || ""}, ${data.state || ""}, ${data.postcode || ""}`;

    res.json({ location });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});
const mongoose = require("mongoose");

router.post("/foodData", async (req, res) => {
  try {
    const foodCollection = mongoose.connection.db.collection("food_items");
    const categoryCollection = mongoose.connection.db.collection("Categories");

    const foodData = await foodCollection.find({}).toArray();
    const catData = await categoryCollection.find({}).toArray();

    res.json([foodData, catData]);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//
// 🧾 ORDER DATA (FIXED STRUCTURE)
//
router.post("/orderData", async (req, res) => {
  try {
    const { order_data, email, order_date } = req.body;

    // ✅ 👉 ADD THIS LINE HERE
    console.log("Incoming order_data:", order_data);

    let existingOrder = await Order.findOne({ email });
    if (!existingOrder) {
      await Order.create({
        email,
        order_data: [
          {
            Order_date: order_date,
            items: order_data,
          },
        ],
      });
    } else {
      await Order.findOneAndUpdate(
        { email },
        {
          $push: {
            order_data: {
              Order_date: order_date,
              items: order_data,
            },
          },
        },
      );
    }
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.send("Server Error", error.message);
  }
});

//
// 📦 MY ORDERS
//
router.post("/myOrderData", async (req, res) => {
  try {
    let existingOrder = await Order.findOne({ email: req.body.email });
    res.json({ orderData: existingOrder });
  } catch (error) {
    res.send("Error", error.message);
  }
});

module.exports = router;
