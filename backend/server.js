const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config({ path: '../.env' }); 

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());


if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.error("Error: RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables");
    process.exit(1);
}

if (!process.env.RAZORPAY_KEY_ID.startsWith('rzp_test_') && !process.env.RAZORPAY_KEY_ID.startsWith('rzp_live_')) {
    console.error("Error: Invalid RAZORPAY_KEY_ID format. Should start with 'rzp_test_' or 'rzp_live_'");
    process.exit(1);
}

if (process.env.RAZORPAY_KEY_SECRET.length < 10) {
    console.error("Error: RAZORPAY_KEY_SECRET seems too short. Please check your credentials.");
    process.exit(1);
}

let instance;
try {
    instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID.trim(),
        key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
    });
    console.log("Razorpay instance initialized successfully");
} catch (error) {
    console.error("Error initializing Razorpay instance:", error);
    process.exit(1);
}

console.log("Razorpay instance initialized with key_id:", process.env.RAZORPAY_KEY_ID);
console.log("Razorpay key_secret is configured:", !!process.env.RAZORPAY_KEY_SECRET);

app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

app.post('/api/create-razorpay-order', async (req, res) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return res.status(400).json({ 
                success: false,
                message: "Amount and currency are required." 
            });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ 
                success: false,
                message: "Amount must be a positive number." 
            });
        }

        const options = {
            amount: Math.round(amount * 100), 
            currency: currency,
            receipt: `receipt_order_${Date.now()}`, 
        };

        console.log("Creating Razorpay order with options:", options);

        const order = await instance.orders.create(options);
        
        console.log("Razorpay order created successfully:", order.id);
        
        res.json({
            success: true,
            orderId: order.id,
            currency: order.currency,
            amount: order.amount,
        });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to create Razorpay order.", 
            error: error.message 
        });
    }
});

app.post('/api/verify-razorpay-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // Validate input
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ 
                status: "failure", 
                message: "Missing required payment parameters." 
            });
        }

        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');

        if (digest === razorpay_signature) {
            

            console.log("Payment verified successfully!");
            console.log("Payment ID:", razorpay_payment_id);
            console.log("Order ID:", razorpay_order_id);
            
            res.json({ 
                status: "success", 
                message: "Payment verified successfully!",
                payment_id: razorpay_payment_id,
                order_id: razorpay_order_id
            });
        } else {
            console.error("Payment verification failed: Invalid signature.");
            console.error("Expected signature:", digest);
            console.error("Received signature:", razorpay_signature);
            
            res.status(400).json({ 
                status: "failure", 
                message: "Payment verification failed: Invalid signature." 
            });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ 
            status: "failure", 
            message: "Internal server error during payment verification.",
            error: error.message 
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        success: false,
        message: 'Internal server error',
        error: err.message 
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/api/health`);
});