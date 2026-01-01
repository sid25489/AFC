import express from "express";
import { body, validationResult } from "express-validator";
import MenuItem from "../models/Menu";
import { protect, authorize } from "../middleware/auth";
import { AuthRequest } from "../middleware/auth";
import { isHappyHour, getHappyHourPrice } from "../utils/happyHour";

const router = express.Router();

// @route   GET /api/menu
// @desc    Get all menu items (with happy hour pricing if applicable)
// @access  Public
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    const query: any = { isAvailable: true };

    if (category) {
      query.category = category;
    }

    const menuItems = await MenuItem.find(query).sort({ category: 1, name: 1 });

    // Apply happy hour pricing if applicable
    const itemsWithPricing = menuItems.map((item) => {
      const itemObj = item.toObject();
      if (isHappyHour() && item.happyHourPrice) {
        itemObj.currentPrice = item.happyHourPrice;
        itemObj.isHappyHour = true;
      } else {
        itemObj.currentPrice = item.price;
        itemObj.isHappyHour = false;
      }
      return itemObj;
    });

    res.json({
      success: true,
      count: itemsWithPricing.length,
      isHappyHour: isHappyHour(),
      data: itemsWithPricing,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET /api/menu/:id
// @desc    Get single menu item
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    const itemObj = item.toObject();
    if (isHappyHour() && item.happyHourPrice) {
      itemObj.currentPrice = item.happyHourPrice;
      itemObj.isHappyHour = true;
    } else {
      itemObj.currentPrice = item.price;
      itemObj.isHappyHour = false;
    }

    res.json({ success: true, data: itemObj });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   POST /api/menu
// @desc    Create menu item
// @access  Private (Admin)
router.post(
  "/",
  protect,
  authorize("admin"),
  [
    body("name").trim().notEmpty(),
    body("description").trim().notEmpty(),
    body("price").isFloat({ min: 0 }),
    body("category").isIn([
      "Breakfast",
      "Brunch",
      "Lunch",
      "Dinner",
      "Coffee & Drinks",
      "Cocktails, Beer, Wine",
      "Vegetarian & Healthy Options",
      "Kids Menu",
    ]),
  ],
  async (req: AuthRequest, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const menuItem = await MenuItem.create(req.body);

      res.status(201).json({ success: true, data: menuItem });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// @route   PUT /api/menu/:id
// @desc    Update menu item
// @access  Private (Admin)
router.put("/:id", protect, authorize("admin"), async (req: AuthRequest, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ success: true, data: menuItem });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   DELETE /api/menu/:id
// @desc    Delete menu item (soft delete - set isAvailable to false)
// @access  Private (Admin)
router.delete("/:id", protect, authorize("admin"), async (req: AuthRequest, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isAvailable: false },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }

    res.json({ success: true, message: "Menu item deleted" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

