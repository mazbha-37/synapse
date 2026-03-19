import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Dashboard from "@/models/Dashboard";
import AuditLog from "@/models/AuditLog";
import { registerSchema } from "@/validators/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate input
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    await dbConnect();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
      provider: "credentials",
      isActive: true,
    });

    // Create default dashboard
    await Dashboard.create({
      userId: user._id,
      name: "My Dashboard",
      description: "Your personal dashboard",
      isDefault: true,
      layout: "[]",
    });

    // Log registration
    await AuditLog.create({
      userId: user._id,
      action: "user.register",
      details: `New user registered: ${email}`,
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
