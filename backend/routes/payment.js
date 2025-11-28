const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

// for stripe payment gateway
const stripe = require('stripe')(process.env.STRIPE_SKRT_KET_TST);

// for razorpay payment gateway
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_TEST,
  key_secret: process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_TEST,
});



router.post('/stripe', asyncHandler(async (req, res) => {
  try {
    console.log('stripe');
    const { email, name, address, amount, currency, description } = req.body;

    const customer = await stripe.customers.create({
      email: email,
      name: name,
      address: address,
    });

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      customer: customer.id,
      description: description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PBLK_KET_TST,
    });

  } catch (error) {
    console.log(error);
    return res.json({ error: true, message: error.message, data: null });
  }
}));

// Create Razorpay order
router.post('/razorpay/create-order', asyncHandler(async (req, res) => {
  try {
    console.log('razorpay create order');
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ 
        error: true, 
        message: 'Amount is required', 
        data: null 
      });
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise (smallest currency unit)
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      error: false,
      message: 'Order created successfully',
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_TEST,
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      error: true, 
      message: error.message, 
      data: null 
    });
  }
}));

// Verify Razorpay payment
router.post('/razorpay/verify', asyncHandler(async (req, res) => {
  try {
    console.log('razorpay verify payment');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        error: true,
        message: 'Missing payment verification details',
        data: null
      });
    }

    const crypto = require('crypto');
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET_TEST)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({
        error: false,
        message: 'Payment verified successfully',
        data: {
          orderId: razorpay_order_id,
          paymentId: razorpay_payment_id,
          verified: true
        }
      });
    } else {
      res.status(400).json({
        error: true,
        message: 'Payment verification failed - Invalid signature',
        data: null
      });
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: true,
      message: error.message,
      data: null
    });
  }
}));

// Legacy endpoint - returns key for Flutter SDK
router.post('/razorpay', asyncHandler(async (req, res) => {
  try {
    console.log('razorpay')
    const razorpayKey = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_TEST;
    res.json({ key: razorpayKey });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: true, message: error.message, data: null });
  }
}));





module.exports = router;