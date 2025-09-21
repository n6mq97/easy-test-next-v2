'use server';

import prisma from '@/lib/prisma';

export type ProgramStats = {
  programId: string;
  totalAttempts: number;
  correctAnswers: number;
  progress: number;
};

export async function getProgramsStats(
  userId: string,
): Promise<ProgramStats[]> {
  const programs = await prisma.program.findMany({
    where: { userId },
    select: { id: true },
  });

  const stats = await Promise.all(
    programs.map(async program => {
      const whereClause = {
        question: {
          section: {
            programId: program.id,
          },
        },
        userId,
      };

      const [totalAttempts, correctAnswers] = await Promise.all([
        prisma.answerResult.count({ where: whereClause }),
        prisma.answerResult.count({
          where: { ...whereClause, isCorrect: true },
        }),
      ]);

      return {
        programId: program.id,
        totalAttempts,
        correctAnswers,
        progress:
          totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0,
      };
    }),
  );

  return stats;
}

export type SectionStats = {
  sectionId: string;
  totalAttempts: number;
  correctAnswers: number;
  progress: number;
};

export async function getSectionsStats(
  programId: string,
  userId: string,
): Promise<SectionStats[]> {
  const sections = await prisma.section.findMany({
    where: { programId },
    select: { id: true },
  });

  const stats = await Promise.all(
    sections.map(async section => {
      const whereClause = {
        question: {
          sectionId: section.id,
        },
        userId,
      };
      const [totalAttempts, correctAnswers] = await Promise.all([
        prisma.answerResult.count({ where: whereClause }),
        prisma.answerResult.count({
          where: { ...whereClause, isCorrect: true },
        }),
      ]);

      return {
        sectionId: section.id,
        totalAttempts,
        correctAnswers,
        progress:
          totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0,
      };
    }),
  );

  return stats;
}

export type QuestionStats = {
  questionId: string;
  totalAttempts: number;
  correctAnswers: number;
  progress: number;
};

export async function getQuestionsStats(
  sectionId: string,
  userId: string,
): Promise<QuestionStats[]> {
  const questions = await prisma.question.findMany({
    where: { sectionId },
    select: { id: true },
  });

  const stats = await Promise.all(
    questions.map(async question => {
      const whereClause = {
        questionId: question.id,
        userId,
      };
      const [totalAttempts, correctAnswers] = await Promise.all([
        prisma.answerResult.count({ where: whereClause }),
        prisma.answerResult.count({
          where: { ...whereClause, isCorrect: true },
        }),
      ]);

      return {
        questionId: question.id,
        totalAttempts,
        correctAnswers,
        progress:
          totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0,
      };
    }),
  );
  return stats;
}
