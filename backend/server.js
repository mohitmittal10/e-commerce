const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' }); // Load environment variables from .env at project root

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your frontend to make requests to this backend
app.use(express.json()); // To parse JSON request bodies

// Initialize Razorpay instance
const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});
console.log("Razorpay instance initialized with key_id:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay key_secret is ", process.env.RAZORPAY_KEY_SECRET );
// Endpoint to create a Razorpay order
app.post('/api/create-razorpay-order', async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        return res.status(400).json({ message: "Amount and currency are required." });
    }

    const options = {
        amount: amount * 100, // Razorpay expects amount in paisa (e.g., ₹100 = 10000 paisa)
        currency: currency,
        receipt: `receipt_order_${Date.now()}`, // Unique receipt ID for your reference
    };

    try {
        const order = await instance.orders.create(options);
        res.json({
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ message: "Failed to create Razorpay order.", error: error.message });
    }
});

// Endpoint to verify payment signature (webhook or direct call from frontend after handler)
app.post('/api/verify-razorpay-payment', async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body;

    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest === razorpay_signature) {
        // Payment is verified!
        // In a real application, you would now update your database:
        // - Mark the order as paid.
        // - Save the razorpay_payment_id for future reference.
        // - Fulfill the order (e.g., send confirmation email).

        console.log("Payment verified successfully!");
        res.json({ status: "success", message: "Payment verified successfully!" });
    } else {
        console.error("Payment verification failed: Invalid signature.");
        res.status(400).json({ status: "failure", message: "Payment verification failed: Invalid signature." });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});