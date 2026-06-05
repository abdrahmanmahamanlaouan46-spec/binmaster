import { NextRequest, NextResponse } from "next/server";
import { decimalToBinary, binaryToDecimal } from "@/lib/conversions";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, input } = body;

    if (!type || !input) {
      return NextResponse.json(
        { error: "Type et input requis" },
        { status: 400 }
      );
    }

    if (type === "dec2bin") {
      const decimal = parseInt(input, 10);
      if (isNaN(decimal) || decimal < 0 || decimal > 1048575) {
        return NextResponse.json(
          { error: "Veuillez entrer un nombre décimal valide (0 - 1 048 575)" },
          { status: 400 }
        );
      }
      const result = decimalToBinary(decimal);
      return NextResponse.json(result);
    } else if (type === "bin2dec") {
      const binary = input.toString().trim();
      if (!/^[01]+$/.test(binary) || binary.length > 20) {
        return NextResponse.json(
          { error: "Veuillez entrer un nombre binaire valide (0 et 1 uniquement, max 20 bits)" },
          { status: 400 }
        );
      }
      const result = binaryToDecimal(binary);
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Type invalide. Utilisez 'dec2bin' ou 'bin2dec'" },
        { status: 400 }
      );
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur interne";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
