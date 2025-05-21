import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyAuthToken } from "@/app/lib/auth";

export async function GET(req: NextRequest) {
  try {
    // Verify token
    const decoded = verifyAuthToken(req);

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by ID
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        isAdmin: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error getting current user:", error);
    return NextResponse.json(
      { error: "Failed to get user information" },
      { status: 500 }
    );
  }
}
