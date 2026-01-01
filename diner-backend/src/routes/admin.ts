import express from "express";
import { protect, authorize } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import Order from "../models/Order";
import MenuItem from "../models/Menu";
import { isBusinessHours, isHappyHour } from "../utils/happyHour";

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize("admin"));

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get("/dashboard", async (req: AuthRequest, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Today's orders
    const todayOrders = await Order.find({
      createdAt: { $gte: today },
    });

    // Total revenue today
    const todayRevenue = todayOrders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.total, 0);

    // Pending orders
    const pendingOrders = await Order.find({ status: "pending" }).countDocuments();

    // Popular items (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
    });

    const itemCounts: Record<string, number> = {};
    recentOrders.forEach((order) => {
      order.items.forEach((item) => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
      });
    });

    const popularItems = Object.entries(itemCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Menu statistics
    const totalMenuItems = await MenuItem.countDocuments();
    const availableMenuItems = await MenuItem.countDocuments({ isAvailable: true });

    res.json({
      success: true,
      data: {
        today: {
          orders: todayOrders.length,
          revenue: todayRevenue,
        },
        pendingOrders,
        popularItems,
        menu: {
          total: totalMenuItems,
          available: availableMenuItems,
        },
        businessStatus: {
          isOpen: isBusinessHours(),
          isHappyHour: isHappyHour(),
        },
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/admin/orders/stats
// @desc    Get order statistics
// @access  Private (Admin)
router.get("/orders/stats", async (req: AuthRequest, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query: any = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string),
      };
    }

    const orders = await Order.find(query);

    const stats = {
      total: orders.length,
      byStatus: {
        pending: orders.filter((o) => o.status === "pending").length,
        confirmed: orders.filter((o) => o.status === "confirmed").length,
        preparing: orders.filter((o) => o.status === "preparing").length,
        ready: orders.filter((o) => o.status === "ready").length,
        completed: orders.filter((o) => o.status === "completed").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
      },
      byPaymentStatus: {
        pending: orders.filter((o) => o.paymentStatus === "pending").length,
        paid: orders.filter((o) => o.paymentStatus === "paid").length,
        failed: orders.filter((o) => o.paymentStatus === "failed").length,
        refunded: orders.filter((o) => o.paymentStatus === "refunded").length,
      },
      totalRevenue: orders
        .filter((o) => o.paymentStatus === "paid")
        .reduce((sum, o) => sum + o.total, 0),
      averageOrderValue: 0,
    };

    const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
    if (paidOrders.length > 0) {
      stats.averageOrderValue = stats.totalRevenue / paidOrders.length;
    }

    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

