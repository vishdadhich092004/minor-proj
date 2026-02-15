const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const Order = require('../model/order');
const { ensureConnection } = require('../utils/dbHelper');

// Get all orders
router.get('/', asyncHandler(async (req, res) => {
    try {
        // Ensure database connection
        await ensureConnection();

        // Set a timeout for the query (5 seconds)
        const queryPromise = Order.find()
            .populate({
                path: 'couponCode',
                select: 'id couponCode discountType discountAmount'
            })
            .populate({
                path: 'userID',
                select: 'id name'
            })
            .sort({ _id: -1 })
            .lean()
            .maxTimeMS(5000); // 5 second timeout

        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Query timeout')), 5000)
        );

        const orders = await Promise.race([queryPromise, timeoutPromise]);

        res.json({ success: true, message: "Orders retrieved successfully.", data: orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        if (error.name === 'MongoServerSelectionError' || error.name === 'MongooseServerSelectionError') {
            return res.status(503).json({
                success: false,
                message: "Database connection failed. Please check MongoDB Atlas IP whitelist settings and try again."
            });
        }
        if (error.message === 'Query timeout') {
            return res.status(504).json({
                success: false,
                message: "Request timeout. The query took too long to execute."
            });
        }
        res.status(500).json({ success: false, message: error.message });
    }
}));


router.get('/orderByUserId/:userId', asyncHandler(async (req, res) => {
    try {
        const userId = req.params.userId;
        const orders = await Order.find({ userID: userId })
            .populate('couponCode', 'id couponCode discountType discountAmount')
            .populate('userID', 'id name')
            .sort({ _id: -1 });
        res.json({ success: true, message: "Orders retrieved successfully.", data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));


// Get an order by ID
router.get('/:id', asyncHandler(async (req, res) => {
    try {
        const orderID = req.params.id;
        const order = await Order.findById(orderID)
            .populate('couponCode', 'id couponCode discountType discountAmount')
            .populate('userID', 'id name');
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.json({ success: true, message: "Order retrieved successfully.", data: order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Create a new order
router.post('/', asyncHandler(async (req, res) => {
    const { userID, orderStatus, items, totalPrice, shippingAddress, paymentMethod, couponCode, orderTotal, trackingUrl } = req.body;
    if (!userID || !items || !totalPrice || !shippingAddress || !paymentMethod || !orderTotal) {
        return res.status(400).json({ success: false, message: "User ID, items, totalPrice, shippingAddress, paymentMethod, and orderTotal are required." });
    }

    try {
        // Ensure database connection before creating order
        await ensureConnection();

        const order = new Order({ userID, orderStatus, items, totalPrice, shippingAddress, paymentMethod, couponCode, orderTotal, trackingUrl });
        const newOrder = await order.save();
        res.json({ success: true, message: "Order created successfully.", data: newOrder });
    } catch (error) {
        console.error('Error creating order:', error);
        // Provide more specific error messages
        if (error.name === 'MongoServerSelectionError' || error.name === 'MongooseServerSelectionError') {
            return res.status(503).json({
                success: false,
                message: "Database connection failed. Please check MongoDB Atlas IP whitelist settings and try again."
            });
        }
        res.status(500).json({ success: false, message: error.message || "Failed to create order" });
    }
}));

// Update an order
router.put('/:id', asyncHandler(async (req, res) => {
    try {
        const orderID = req.params.id;
        const { orderStatus, trackingUrl } = req.body;
        if (!orderStatus) {
            return res.status(400).json({ success: false, message: "Order Status required." });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderID,
            { orderStatus, trackingUrl },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }

        res.json({ success: true, message: "Order updated successfully.", data: null });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

// Delete an order
router.delete('/:id', asyncHandler(async (req, res) => {
    try {
        const orderID = req.params.id;
        const deletedOrder = await Order.findByIdAndDelete(orderID);
        if (!deletedOrder) {
            return res.status(404).json({ success: false, message: "Order not found." });
        }
        res.json({ success: true, message: "Order deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}));

module.exports = router;
