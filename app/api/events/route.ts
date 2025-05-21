import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { authenticateUser, checkAdmin } from "@/app/lib/auth";

// Get all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      where: { isActive: true },
      orderBy: { date: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// Create a new event (admin only)
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const admin = await checkAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const {
      title,
      description,
      location,
      date,
      time,
      price,
      imageUrl,
      mc,
      dj,
      guestArtist,
      features,
    } = body;

    // Validate required fields
    if (!title || !description || !location || !date || !time || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create event
    const event = await prisma.event.create({
      data: {
        title,
        description,
        location,
        date: new Date(date),
        time,
        price: parseFloat(price),
        imageUrl,
        mc,
        dj,
        guestArtist,
        features,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
