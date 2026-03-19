import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Import models
import User from "../src/models/User";
import Dashboard from "../src/models/Dashboard";
import ApiSource from "../src/models/ApiSource";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Please define the MONGODB_URI environment variable");
  process.exit(1);
}

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Dashboard.deleteMany({});
    await ApiSource.deleteMany({});

    // Create API sources
    console.log("Creating API sources...");
    const apiSources = [
      {
        name: "OpenWeatherMap",
        slug: "weather",
        baseUrl: "https://api.openweathermap.org/data/2.5",
        status: "healthy" as const,
        dailyLimit: 1000000,
      },
      {
        name: "GNews",
        slug: "news",
        baseUrl: "https://gnews.io/api/v4",
        status: "healthy" as const,
        dailyLimit: 100,
      },
      {
        name: "CoinGecko",
        slug: "crypto",
        baseUrl: "https://api.coingecko.com/api/v3",
        status: "healthy" as const,
        dailyLimit: 10000,
      },
      {
        name: "GitHub",
        slug: "github",
        baseUrl: "https://api.github.com",
        status: "healthy" as const,
        dailyLimit: 5000,
      },
      {
        name: "NASA",
        slug: "nasa",
        baseUrl: "https://api.nasa.gov/planetary",
        status: "healthy" as const,
        dailyLimit: 1000,
      },
      {
        name: "AQICN",
        slug: "air-quality",
        baseUrl: "https://api.waqi.info",
        status: "healthy" as const,
        dailyLimit: 1000,
      },
    ];

    await ApiSource.insertMany(apiSources);
    console.log("API sources created");

    // Create admin user
    console.log("Creating admin user...");
    const hashedPassword = await bcrypt.hash("Admin@123", 12);
    const adminUser = await User.create({
      name: "Admin",
      email: "admin@synapse.dev",
      password: hashedPassword,
      role: "admin",
      provider: "credentials",
      isActive: true,
    });
    console.log("Admin user created:", adminUser.email);

    // Create default dashboard for admin
    console.log("Creating default dashboard...");
    const adminDashboard = await Dashboard.create({
      userId: adminUser._id,
      name: "My Dashboard",
      description: "Your personal dashboard",
      isDefault: true,
      layout: JSON.stringify([
        { i: "weather-1", x: 0, y: 0, w: 4, h: 3 },
        { i: "crypto-1", x: 4, y: 0, w: 4, h: 3 },
        { i: "nasa-1", x: 8, y: 0, w: 4, h: 4 },
      ]),
    });
    console.log("Default dashboard created");

    // Create widgets for admin dashboard
    const Widget = mongoose.model(
      "Widget",
      new mongoose.Schema({
        dashboardId: { type: mongoose.Schema.Types.ObjectId, ref: "Dashboard" },
        type: String,
        config: Object,
        position: Object,
      })
    );

    await Widget.insertMany([
      {
        dashboardId: adminDashboard._id,
        type: "weather",
        config: { city: "Dhaka", units: "metric" },
        position: { x: 0, y: 0, w: 4, h: 3 },
      },
      {
        dashboardId: adminDashboard._id,
        type: "crypto",
        config: { coins: ["bitcoin", "ethereum"], currency: "usd" },
        position: { x: 4, y: 0, w: 4, h: 3 },
      },
      {
        dashboardId: adminDashboard._id,
        type: "nasa",
        config: { count: 1 },
        position: { x: 8, y: 0, w: 4, h: 4 },
      },
    ]);
    console.log("Widgets created");

    console.log("\n✅ Seeding completed successfully!");
    console.log("\nAdmin Credentials:");
    console.log("Email: admin@synapse.dev");
    console.log("Password: Admin@123");
    console.log("\nYou can now start the development server with: npm run dev");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seed();
