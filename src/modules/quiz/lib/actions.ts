'use server';

import prisma from '@/lib/prisma';
import { Question } from '@prisma/client';
import { getCurrentUser } from '@/modules/auth';

export type QuizQuestionData = Pick<Question, 'id' | 'questionText' | 'answers'>;

export async function getQuizQuestions({
  sectionId,
  programId,
}: {
  sectionId?: string;
  programId?: string;
}): Promise<QuizQuestionData[]> {
  if ((!sectionId && !programId) || (sectionId && programId)) {
    throw new Error('Please provide either sectionId or programId, but not both.');
  }

  if (sectionId) {
    const questions = await prisma.question.findMany({
      where: { sectionId },
      select: {
        id: true,
        questionText: true,
        answers: true,
      },
    });
    return questions;
  }

  if (programId) {
    const sections = await prisma.section.findMany({
      where: { programId },
      include: {
        questions: {
          select: {
            id: true,
            questionText: true,
            answers: true,
          },
        },
      },
    });

    const allQuestions = sections.flatMap((section) => section.questions);

    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

    return shuffledQuestions.slice(0, 20);
  }

  return [];
}

export async function getQuizQuestionsForMultiplePrograms(
  programIds: string[],
): Promise<QuizQuestionData[]> {
  const sections = await prisma.section.findMany({
    where: {
      programId: {
        in: programIds,
      },
    },
    include: {
      questions: {
        select: {
          id: true,
          questionText: true,
          answers: true,
        },
      },
    },
  });

  const allQuestions = sections.flatMap((section) => section.questions);

  const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

  return shuffledQuestions;
}

export async function submitAnswer({
  questionId,
  selectedAnswerIndex,
}: {
  questionId: string;
  selectedAnswerIndex: number;
}) {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    throw new Error('User not authenticated');
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!question) {
    throw new Error('Question not found');
  }

  const isCorrect = question.correctAnswerIndex === selectedAnswerIndex;

  await prisma.answerResult.create({
    data: {
      isCorrect,
      userId: user.id,
      questionId,
    },
  });

  return {
    isCorrect,
    correctAnswerIndex: question.correctAnswerIndex,
  };
}
