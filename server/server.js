const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Order = require('./models/Order'); // Import the model

dotenv.config();
const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL, // Your Vercel URL
  'http://localhost:5173'   // Keep local for testing
];

// Middleware
app.use(cors());
// app.use(express.json()); // Allows the server to understand JSON data sent from React
// Increase the limit to 50mb (or more if needed)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// --- API ROUTES ---

// 1. Test Route
app.get('/', (req, res) => {
    res.send("Store Management API is running...");
});

// 2. Add New Order (Create)
// app.post('/api/orders', async (req, res) => {
//     try {
//         const newOrder = new Order(req.body);
//         const savedOrder = await newOrder.save();
//         res.status(201).json(savedOrder);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// });
app.post('/api/orders', async (req, res) => {
    try {
        console.log("Data Received:", req.body);
        
        // This is where the error happens. 
        // If the import above is wrong, Order will be undefined.
        const newOrder = new Order(req.body); 
        
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Save Error:", error);
        res.status(400).json({ message: error.message });
    }
});

// 3. Get All Orders (Read)
// app.get('/api/orders', async (req, res) => {
//     try {
//         const orders = await Order.find().sort({ createdAt: -1 });
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });
app.get('/api/orders', async (req, res) => {
    try {
        // Change -1 to 1
        const orders = await Order.find().sort({ createdAt: 1 }); 
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Update Payment Status (Update)
app.patch('/api/orders/:id/payment', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            { paymentStatus: req.body }, 
            { new: true }
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// 1. Update the entire order (for Editing typos)
app.put('/api/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 2. Toggle Delivery Status only
app.patch('/api/orders/:id/delivery', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        order.isDelivered = !order.isDelivered; // Toggle between true/false
        await order.save();
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// server/server.js
app.put('/api/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true } // This returns the updated version of the document
        );
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// DELETE an order by ID
app.delete('/api/orders/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Order deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Bulk Import Orders
app.post('/api/orders/bulk', async (req, res) => {
    try {
        // insertMany is much faster for large excel files
        const savedOrders = await Order.insertMany(req.body);
        res.status(201).json(savedOrders);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});