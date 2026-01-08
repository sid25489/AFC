import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import Order from "../models/Order";
import MenuItem from "../models/Menu";
import { protect, authorize } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { isBusinessHours } from "../utils/happyHour";
import { createPaymentIntent, confirmPaymentIntent } from "../utils/payment";
import { isHappyHour } from "../utils/happyHour";

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Public
router.post(
  "/",
  [
    body("customerName").trim().notEmpty(),
    body("customerEmail").isEmail().normalizeEmail(),
    body("customerPhone").trim().notEmpty(),
    body("items").isArray({ min: 1 }),
    body("deliveryType").isIn(["dine-in", "takeaway"]),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check business hours
      if (!isBusinessHours()) {
        return res.status(400).json({
          error: "We are currently closed. Please order during business hours.",
        });
      }

      const { customerName, customerEmail, customerPhone, items, deliveryType, specialInstructions, paymentMethod } = req.body;

      // Validate and calculate order items
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const menuItem = await MenuItem.findById(item.menuItemId);
        if (!menuItem || !menuItem.isAvailable) {
          return res.status(400).json({
            error: `Menu item ${item.name || item.menuItemId} is not available`,
          });
        }

        // Use happy hour price if applicable
        const price = isHappyHour() && menuItem.happyHourPrice
          ? menuItem.happyHourPrice
          : menuItem.price;

        const itemSubtotal = price * item.quantity;
        subtotal += itemSubtotal;

        orderItems.push({
          menuItemId: menuItem._id,
          name: menuItem.name,
          quantity: item.quantity,
          price: price,
          subtotal: itemSubtotal,
        });
      }

      // Calculate tax (7% Florida sales tax)
      const tax = Math.round(subtotal * 0.07 * 100) / 100;
      const total = subtotal + tax;

      // Create order
      const order = await Order.create({
        customerName,
        customerEmail,
        customerPhone,
        items: orderItems,
        subtotal,
        tax,
        total,
        deliveryType,
        specialInstructions,
        paymentMethod,
        status: "pending",
      });

      // Create payment intent if payment method is card or nfc
      let paymentIntent = null;
      if (paymentMethod === "card" || paymentMethod === "nfc") {
        try {
          paymentIntent = await createPaymentIntent({
            amount: total,
            metadata: {
              orderId: order._id.toString(),
              orderNumber: order.orderNumber,
            },
          });

          order.paymentIntentId = paymentIntent.id;
          await order.save();
        } catch (paymentError) {
          console.error("Payment intent creation failed:", paymentError);
          // Order is still created, but payment will need to be handled separately
        }
      }

      res.status(201).json({
        success: true,
        data: {
          order: order.toObject(),
          paymentIntent: paymentIntent
            ? {
                clientSecret: paymentIntent.client_secret,
                id: paymentIntent.id,
              }
            : null,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Public (for order tracking)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin only)
// @access  Private (Admin)
router.get("/", protect, authorize("admin"), async (req: AuthRequest, res: Response) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: orders,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  [body("status").isIn(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   POST /api/orders/:id/confirm-payment
// @desc    Confirm payment for order
// @access  Private (Admin)
router.post(
  "/:id/confirm-payment",
  protect,
  authorize("admin"),
  async (req: AuthRequest, res) => {
    try {
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (order.paymentIntentId) {
        const paymentIntent = await confirmPaymentIntent(order.paymentIntentId);

        if (paymentIntent.status === "succeeded") {
          order.paymentStatus = "paid";
          await order.save();
        }
      } else {
        // Manual payment confirmation (cash, etc.)
        order.paymentStatus = "paid";
        await order.save();
      }

      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

