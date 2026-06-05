import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const history = await db.conversionHistory.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json(history);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, input, output, steps } = body;

    if (!type || !input || !output) {
      return NextResponse.json(
        { error: "Type, input et output requis" },
        { status: 400 }
      );
    }

    const entry = await db.conversionHistory.create({
      data: {
        type,
        input,
        output,
        steps: steps ? JSON.stringify(steps) : "[]",
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await db.conversionHistory.deleteMany();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
