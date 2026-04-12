const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  order_data: [
    {
      Order_date: {
        type: String,
        required: true,
      },
      items: [
        {
          id: String,
          name: String,
          qty: Number,
          size: String,
          price: Number,
          img: String,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
