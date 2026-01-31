// const mongoose = require('mongoose'); 
// const OrderSchema = new mongoose.Schema({
//   // Order Header (Only 1 per order)
//   orderId: String,
//   date: Date,
//   time: String,
//   platform: String,
//   platformAccount: String,
//   cardUsed: String,
//   cashback: Number,
  
//   // Delivery Details
//   deliveryDate: Date,
//   deliverySlot: String,

//   // Products (Multiple rows)
//   products: [{
//     productName: String,
//     qty: Number,
//     listingPrice: Number,
//     buyingPrice: Number,
//     sellingPrice: Number,
//     netProfit: Number // (Selling - Buying) * Qty
//   }],

//   // Payment Tracking
//   paymentStatus: {
//     isReceived: { type: Boolean, default: false },
//     receivedDate: Date,
//     amountReceived: Number,
//     paymentMethod: String
//   },
  
//   totalOrderProfit: Number
// }, { timestamps: true });
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  date: { type: String, required: true }, // Store as "YYYY-MM-DD"
  time: { type: String },
  platform: { type: String, default: "Amazon" },
  platformAccount: { type: String },
  cardUsed: { type: String },
  cashback: { type: Number, default: 0 },
  
  deliveryDate: { type: String },
  deliverySlot: { type: String },
  isDelivered: { type: Boolean, default: false },

//   products: [{
//     productName: { type: String, required: true },
//     qty: { type: Number, default: 1 },
//     listingPrice: { type: Number, default: 0 },
//     buyingPrice: { type: Number, default: 0 },
//     sellingPrice: { type: Number, default: 0 },
//     netProfit: { type: Number, default: 0 }
//   }],
products: [{
    productName: { type: String, required: true },
    qty: { type: Number, default: 1 },
    listingPrice: { type: Number, default: 0 },
    listingTotal: { type: Number, default: 0 }, // New: Price * Qty
    cashback: { type: Number, default: 0 },     // New: Product-specific discount/cashback
    buyingPrice: { type: Number, default: 0 },
    buyingTotal: { type: Number, default: 0 },  // New: Price * Qty
    sellingPrice: { type: Number, default: 0 },
    sellingTotal: { type: Number, default: 0 }, // New: Price * Qty
    netProfit: { type: Number, default: 0 }
}],

  paymentStatus: {
    isReceived: { type: Boolean, default: false },
    receivedDate: { type: String, default: "" },
    amountReceived: { type: Number, default: 0 },
    paymentMethod: { type: String, default: "" }
  },
  
  totalOrderProfit: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);