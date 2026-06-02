import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Contact } from "@/models/Contact";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, company, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const contact = new Contact({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      company: company?.trim() || "",
      message: message.trim(),
    });

    await contact.save();

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! We will get back to you within 24 hours.",
        id: contact._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact form error:", error);
    if (error.name === "ValidationError") {
      const details = Object.values(error.errors).map((e: any) => e.message);
      return NextResponse.json({ error: "Validation error", details }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to submit. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const contacts = await Contact.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json({ success: true, contacts });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve contacts" }, { status: 500 });
  }
}
