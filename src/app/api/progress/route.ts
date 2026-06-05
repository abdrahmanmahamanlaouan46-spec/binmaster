import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateLevel, BADGES, getXpForExercise } from "@/lib/conversions";

export async function GET() {
  try {
    let progress = await db.studentProgress.findFirst();
    if (!progress) {
      progress = await db.studentProgress.create({
        data: {},
      });
    }
    return NextResponse.json({
      ...progress,
      badges: JSON.parse(progress.badges),
    });
  } catch {
    return NextResponse.json({
      totalExercises: 0,
      correctAnswers: 0,
      streak: 0,
      bestStreak: 0,
      level: 1,
      xp: 0,
      badges: [],
      dec2binCount: 0,
      bin2decCount: 0,
      hardCorrect: 0,
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isCorrect, difficulty, type } = body;

    let progress = await db.studentProgress.findFirst();
    if (!progress) {
      progress = await db.studentProgress.create({ data: {} });
    }

    const xpGained = getXpForExercise(difficulty || "easy", isCorrect);
    const newXp = progress.xp + xpGained;
    const newLevel = calculateLevel(newXp);
    const newTotal = progress.totalExercises + 1;
    const newCorrect = progress.correctAnswers + (isCorrect ? 1 : 0);
    const newStreak = isCorrect ? progress.streak + 1 : 0;
    const newBestStreak = Math.max(progress.bestStreak, newStreak);
    const newDec2Bin = progress.dec2binCount + (type === "dec2bin" ? 1 : 0);
    const newBin2Dec = progress.bin2decCount + (type === "bin2dec" ? 1 : 0);
    const newHardCorrect = progress.hardCorrect + (isCorrect && difficulty === "hard" ? 1 : 0);

    const currentBadges: string[] = JSON.parse(progress.badges);
    const stats = {
      totalExercises: newTotal,
      correctAnswers: newCorrect,
      bestStreak: newBestStreak,
      level: newLevel,
      hardCorrect: newHardCorrect,
    };

    const newBadges = BADGES.filter(
      (badge) => !currentBadges.includes(badge.id) && badge.condition(stats)
    ).map((b) => b.id);

    const allBadges = [...currentBadges, ...newBadges];

    const updated = await db.studentProgress.update({
      where: { id: progress.id },
      data: {
        totalExercises: newTotal,
        correctAnswers: newCorrect,
        streak: newStreak,
        bestStreak: newBestStreak,
        level: newLevel,
        xp: newXp,
        badges: JSON.stringify(allBadges),
        dec2binCount: newDec2Bin,
        bin2decCount: newBin2Dec,
        hardCorrect: newHardCorrect,
      },
    });

    return NextResponse.json({
      ...updated,
      badges: allBadges,
      xpGained,
      newBadges,
    });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
