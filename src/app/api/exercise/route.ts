import { NextRequest, NextResponse } from "next/server";
import { generateExercise } from "@/lib/conversions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, difficulty } = body;

    if (!type || !difficulty) {
      return NextResponse.json(
        { error: "Type et difficulté requis" },
        { status: 400 }
      );
    }

    const exercise = generateExercise(type, difficulty);
    return NextResponse.json(exercise);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la génération" },
      { status: 500 }
    );
  }
}
