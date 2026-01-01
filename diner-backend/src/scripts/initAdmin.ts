import dotenv from "dotenv";
import connectDB from "../config/database";
import User from "../models/User";

dotenv.config();

const initAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || "admin@diner.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    // Check if admin exists
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log(`📧 Email: ${admin.email}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log("\n⚠️  Please change the default password after first login!");
    process.exit(0);
  } catch (error: any) {
    console.error("❌ Error creating admin:", error.message);
    process.exit(1);
  }
};

initAdmin();

