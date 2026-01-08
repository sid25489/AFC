import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: IOrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod?: "card" | "nfc" | "cash";
  paymentIntentId?: string;
  deliveryType: "dine-in" | "takeaway";
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItemId: {
    type: Schema.Types.ObjectId,
    ref: "MenuItem",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  subtotal: {
    type: Number,
    required: true,
  },
}, { _id: false });

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required"],
      trim: true,
      lowercase: true,
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required"],
      trim: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "ready", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["card", "nfc", "cash"],
    },
    paymentIntentId: {
      type: String,
    },
    deliveryType: {
      type: String,
      enum: ["dine-in", "takeaway"],
      required: true,
    },
    specialInstructions: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique order number before saving
OrderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    try {
      // Use this.constructor to avoid circular dependency
      const OrderModel = this.constructor as mongoose.Model<IOrder>;
      const count = await OrderModel.countDocuments();
      this.orderNumber = `ORD-${Date.now()}-${String(count + 1).padStart(4, '0')}`;
    } catch (error) {
      // Fallback to timestamp-only if count fails
      this.orderNumber = `ORD-${Date.now()}`;
    }
  }
  next();
});

export default mongoose.model<IOrder>("Order", OrderSchema);

