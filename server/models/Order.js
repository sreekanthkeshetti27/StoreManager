const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    orderId: String,
    date: String,
    platform: String,
    platformAccount: String,
    cardUsed: String,
    cashbackAmount: { type: Number, default: 0 },
    
    totalListingPrice: Number,
    totalBuyingPrice: Number,
    totalSellingPrice: Number,
    totalOrderProfit: Number,

    products: [{
        productName: String,
        qty: Number,
        listingPrice: Number,
        listingTotal: Number,
        buyingPrice: Number,
        buyingTotal: Number,
        sellingPrice: Number,
        sellingTotal: Number,
        netProfit: Number
    }],
    deliveryDate: String,
    deliverySlot: String,
    isDelivered: { type: Boolean, default: false },
    paymentStatus: {
        isReceived: { type: Boolean, default: false },
        receivedDate: String,
        amountReceived: Number,
        paymentMethod: String
    }
}, { timestamps: true });

// MAKE SURE THIS LINE IS EXACTLY LIKE THIS:
module.exports = mongoose.model('Order', OrderSchema);