const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Product = require('../models/Product');

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @route   POST /api/payment/create-order
// @desc    Create Razorpay order
// @access  Public
router.post('/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
      notes: {
        created_at: new Date().toISOString()
      }
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ 
      message: 'Error creating payment order',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/payment/verify
// @desc    Verify Razorpay payment
// @access  Public
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment verification data' });
    }

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValidSignature = expectedSignature === razorpay_signature;

    if (!isValidSignature) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid payment signature' 
      });
    }

    // Find and update order in database
    if (order_id) {
      const order = await Order.findById(order_id);
      
      if (order) {
        order.paymentInfo.status = 'completed';
        order.paymentInfo.razorpayOrderId = razorpay_order_id;
        order.paymentInfo.razorpayPaymentId = razorpay_payment_id;
        order.paymentInfo.razorpaySignature = razorpay_signature;
        order.orderStatus = 'confirmed';
        
        await order.save();

        // Update product stock
        for (const item of order.items) {
          await Product.findByIdAndUpdate(
            item.product,
            { $inc: { stock: -item.quantity } }
          );
        }
      }
    }

    // Fetch payment details from Razorpay
    try {
      const payment = await razorpay.payments.fetch(razorpay_payment_id);
      
      res.json({
        success: true,
        message: 'Payment verified successfully',
        payment: {
          id: payment.id,
          status: payment.status,
          method: payment.method,
          amount: payment.amount / 100,
          currency: payment.currency
        }
      });
    } catch (fetchError) {
      console.error('Error fetching payment details:', fetchError);
      
      // Still return success as signature was valid
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error verifying payment' 
    });
  }
});

// @route   POST /api/payment/capture
// @desc    Capture payment (for manual capture)
// @access  Public
router.post('/capture', async (req, res) => {
  try {
    const { payment_id, amount } = req.body;

    if (!payment_id || !amount) {
      return res.status(400).json({ message: 'Payment ID and amount are required' });
    }

    const capturedPayment = await razorpay.payments.capture(
      payment_id,
      Math.round(amount * 100), // Amount in paise
      'INR'
    );

    res.json({
      success: true,
      message: 'Payment captured successfully',
      payment: {
        id: capturedPayment.id,
        status: capturedPayment.status,
        amount: capturedPayment.amount / 100
      }
    });
  } catch (error) {
    console.error('Payment capture error:', error);
    res.status(500).json({ 
      message: 'Error capturing payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/payment/details/:payment_id
// @desc    Get payment details
// @access  Public
router.get('/details/:payment_id', async (req, res) => {
  try {
    const { payment_id } = req.params;

    const payment = await razorpay.payments.fetch(payment_id);

    res.json({
      success: true,
      payment: {
        id: payment.id,
        status: payment.status,
        method: payment.method,
        amount: payment.amount / 100,
        currency: payment.currency,
        created_at: payment.created_at,
        bank: payment.bank,
        wallet: payment.wallet,
        vpa: payment.vpa
      }
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    res.status(500).json({ 
      message: 'Error fetching payment details' 
    });
  }
});

// @route   POST /api/payment/refund
// @desc    Create refund
// @access  Admin (you can add auth middleware)
router.post('/refund', async (req, res) => {
  try {
    const { payment_id, amount, reason = 'requested_by_customer' } = req.body;

    if (!payment_id) {
      return res.status(400).json({ message: 'Payment ID is required' });
    }

    const refundOptions = {
      payment_id,
      amount: amount ? Math.round(amount * 100) : undefined, // Full refund if amount not specified
      notes: {
        reason,
        refund_date: new Date().toISOString()
      }
    };

    const refund = await razorpay.payments.refund(payment_id, refundOptions);

    res.json({
      success: true,
      message: 'Refund created successfully',
      refund: {
        id: refund.id,
        status: refund.status,
        amount: refund.amount / 100,
        currency: refund.currency
      }
    });
  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({ 
      message: 'Error creating refund',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;