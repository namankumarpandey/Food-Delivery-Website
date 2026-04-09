const mongoose = require("mongoose");

const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  name: String,
  qty: Number,
  size: String,
  price: Number,
});

const OrderSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    order_data: [
      {
        Order_date: {
          type: Date,
          default: Date.now,
        },
        items: [OrderItemSchema],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", OrderSchema);